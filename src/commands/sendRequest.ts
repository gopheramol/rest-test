import * as vscode from 'vscode';
import axios from 'axios';
import { getWebviewContent } from '../webviews/apiRequestWebview';
import { generateCurlCommand } from '../utils/curlGenerator';
import { RestApiTreeProvider } from '../providers/RestApiTreeProvider';

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as http from 'http';
import * as https from 'https';

interface PhaseTimings {
  start: number;
  dnsEnd?: number;
  connectEnd?: number;
  tlsEnd?: number;
}

/**
 * Wraps an http(s) Agent so we can record real connection-phase timestamps
 * (DNS lookup, TCP connect, TLS handshake) from the underlying socket.
 */
function instrumentAgent(agent: http.Agent, timings: PhaseTimings): void {
  const orig = (agent as any).createConnection;
  if (typeof orig !== 'function') {
    return;
  }
  (agent as any).createConnection = function (options: any, cb: any) {
    const socket = orig.call(this, options, cb);
    socket.once('lookup', () => { timings.dnsEnd = Date.now(); });
    socket.once('connect', () => { timings.connectEnd = Date.now(); });
    socket.once('secureConnect', () => { timings.tlsEnd = Date.now(); });
    return socket;
  };
}

/**
 * Turns raw phase timestamps into real, non-overlapping durations. Phases that
 * didn't occur (e.g. TLS on a plain-http request, or DNS for an IP literal)
 * are reported as null so the UI can show them as not-applicable.
 */
function computeTimings(t: PhaseTimings, endTime: number): Record<string, number | null> {
  const dns = t.dnsEnd !== undefined ? t.dnsEnd - t.start : null;
  const tcp = t.connectEnd !== undefined && t.dnsEnd !== undefined ? t.connectEnd - t.dnsEnd : null;
  const tls = t.tlsEnd !== undefined && t.connectEnd !== undefined ? t.tlsEnd - t.connectEnd : null;
  const connectionReady = t.tlsEnd ?? t.connectEnd ?? t.dnsEnd ?? t.start;
  const transfer = endTime - connectionReady; // request send + server processing + download
  return { dns, tcp, tls, transfer, total: endTime - t.start };
}

interface SavedRequest {
  name: string;
  method: string;
  url: string;
  body: string;
  headers: { key: string; value: string }[];
  queryParams: { key: string; value: string }[];
}

/**
 * Handler for the sendRequest command
 */
export function registerSendRequestCommand(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider
): vscode.Disposable {
  return vscode.commands.registerCommand('restApiTest.sendRequest', async (savedRequest?: SavedRequest) => {
    const panel = vscode.window.createWebviewPanel(
      'restApiTest',
      savedRequest ? `REST TEST - ${savedRequest.name}` : 'REST TEST',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
      }
    );

    const storedState = savedRequest || context.globalState.get('restApiTesterState', {
      method: 'GET',
      url: '',
      body: '',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Accept', value: 'application/json' }
      ],
      queryParams: []
    });

    const iconCssUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'media', 'material-icons.css')
    ).toString();
    panel.webview.html = getWebviewContent(storedState, iconCssUri);

    // Tracks the in-flight request for this panel so it can be cancelled.
    let activeController: AbortController | null = null;

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'cancelRequest':
          if (activeController) {
            activeController.abort();
          }
          return;

        case 'saveState':
          await context.globalState.update('restApiTesterState', message.state);
          return;

        case 'saveRequest': {
          const requestData = message.request;
          const savedRequests = context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);

          // Check if request with same name exists
          const existingIndex = savedRequests.findIndex(req => req.name === requestData.name);
          if (existingIndex !== -1) {
            // Update existing request
            savedRequests[existingIndex] = requestData;
          } else {
            // Add new request
            savedRequests.push(requestData);
          }

          await context.globalState.update('restApiTesterSavedRequests', savedRequests);
          treeProvider.refresh();
          return;
        }

        case 'copyToClipboard':
          await vscode.env.clipboard.writeText(message.text);
          panel.webview.postMessage({
            type: 'copySuccess',
            message: 'Response copied to clipboard!'
          });
          return;

        case 'copyAsCurl':
          const curlCommand = generateCurlCommand(message);
          await vscode.env.clipboard.writeText(curlCommand);
          panel.webview.postMessage({
            type: 'copySuccess',
            message: 'cURL command copied to clipboard!'
          });
          return;


        case 'openFile': {
          const filePath = message.filePath;
          if (fs.existsSync(filePath)) {
            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document);
          } else {
            vscode.window.showErrorMessage('File not found: ' + filePath);
          }
          return;
        }

        case 'saveResponse': {
          const tempFilePath = message.filePath;
          const options: vscode.SaveDialogOptions = {
            defaultUri: vscode.Uri.file('response.json'),
            filters: {
              'JSON': ['json'],
              'All Files': ['*']
            }
          };

          const uri = await vscode.window.showSaveDialog(options);
          if (uri && fs.existsSync(tempFilePath)) {
            try {
              await fs.promises.copyFile(tempFilePath, uri.fsPath);
              vscode.window.showInformationMessage('Response saved successfully!');
            } catch (err) {
              vscode.window.showErrorMessage('Failed to save file: ' + err);
            }
          }
          return;
        }

        case 'sendRequest': {
          const { method, url, body, headers, queryParams } = message;
          try {
            console.log('Sending request:', { method, url, body, headers, queryParams });

            const urlObj = new URL(url);

            // The URL string may already carry params that the webview also
            // mirrors into the params table, so skip exact key+value duplicates
            // to avoid emitting e.g. ?resource=vat&resource=vat.
            const hasParam = (key: string, value: string) =>
              urlObj.searchParams.getAll(key).includes(value);

            // Process query parameters correctly - only include enabled ones
            if (queryParams && Array.isArray(queryParams)) {
              queryParams.forEach((param: { key: string; value: string; enabled?: boolean }) => {
                if (param.key && param.value && param.enabled !== false && !hasParam(param.key, param.value)) {
                  urlObj.searchParams.append(param.key, param.value);
                }
              });
            } else if (queryParams && typeof queryParams === 'object') {
              Object.entries(queryParams).forEach(([key, value]) => {
                if (key && value && !hasParam(key, value as string)) {
                  urlObj.searchParams.append(key, value as string);
                }
              });
            }


            // Process headers correctly
            const processedHeaders: Record<string, string> = {};
            if (headers && Array.isArray(headers)) {
              headers.forEach((header: { key: string; value: string }) => {
                if (header.key && header.value) {
                  processedHeaders[header.key] = header.value;
                }
              });
            } else if (headers && typeof headers === 'object') {
              Object.entries(headers).forEach(([key, value]) => {
                if (key && value) {
                  processedHeaders[key] = value as string;
                }
              });
            }

            // Set Content-Type for POST/PUT/PATCH if not already set and body exists
            if (body && ['post', 'put', 'patch'].includes(method.toLowerCase()) && !processedHeaders['Content-Type']) {
              processedHeaders['Content-Type'] = 'application/json';
            }

            // Per-request agents instrumented for real phase timing. keepAlive
            // is off so every request makes a fresh connection (accurate DNS/TCP/TLS).
            const isHttps = urlObj.protocol === 'https:';
            const timings: PhaseTimings = { start: Date.now() };
            const httpAgent = new http.Agent({ keepAlive: false });
            const httpsAgent = new https.Agent({ keepAlive: false });
            instrumentAgent(isHttps ? httpsAgent : httpAgent, timings);

            // Allow this request to be cancelled from the webview.
            activeController = new AbortController();

            const startTime = timings.start;
            const response = await axios({
              method: method.toLowerCase(),
              url: urlObj.toString(),
              data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
              headers: processedHeaders,
              timeout: 30000, // 30 second timeout
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              validateStatus: () => true,
              signal: activeController.signal,
              httpAgent,
              httpsAgent
            });
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            const timing = computeTimings(timings, endTime);
            activeController = null;

            console.log('Response received:', {
              status: response.status,
              statusText: response.statusText,
              responseTime
            });

            // Check response size
            const jsonString = JSON.stringify(response.data);
            const sizeInBytes = Buffer.byteLength(jsonString);
            const sizeInMB = sizeInBytes / (1024 * 1024);

            if (sizeInMB > 2) {
              // Handle large response
              const tempDir = os.tmpdir();
              const tempFilePath = path.join(tempDir, `response-${Date.now()}.json`);

              await fs.promises.writeFile(tempFilePath, jsonString);

              // Create truncated preview
              let previewData;
              if (Array.isArray(response.data)) {
                previewData = response.data.slice(0, 50); // First 50 items
              } else if (typeof response.data === 'object' && response.data !== null) {
                previewData = {} as Record<string, any>;
                let count = 0;
                for (const key in response.data) {
                  if (count > 50) break;
                  previewData[key] = (response.data as Record<string, any>)[key];
                  count++;
                }
              } else {
                previewData = String(response.data).substring(0, 10000);
              }

              panel.webview.postMessage({
                type: 'response',
                status: response.status,
                statusText: response.statusText,
                data: previewData,
                responseTime: responseTime,
                headers: response.headers || {},
                isLargeResponse: true,
                sizeInMB: sizeInMB.toFixed(2),
                tempFilePath: tempFilePath,
                timing: timing
              });
            } else {
              // Send response data normally
              panel.webview.postMessage({
                type: 'response',
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                responseTime: responseTime,
                headers: response.headers || {},
                timing: timing
              });
            }

          } catch (error) {
            console.error('Request error:', error);

            const wasCancelled = activeController?.signal.aborted ||
              (axios.isCancel && axios.isCancel(error));
            activeController = null;

            // A user-initiated cancel isn't an error — tell the webview to reset.
            if (wasCancelled) {
              panel.webview.postMessage({ type: 'cancelled' });
              break;
            }

            let errorMessage = 'An unknown error occurred.';
            let errorData = null;

            if (axios.isAxiosError(error)) {
              if (error.response) {
                errorMessage = `HTTP ${error.response.status} - ${error.response.statusText}`;
                errorData = error.response.data;
              } else if (error.request) {
                errorMessage = 'No response received from server. Check your network connection.';
              } else {
                errorMessage = `Request failed: ${error.message}`;
              }
            } else if (error instanceof Error) {
              errorMessage = `Error: ${error.message}`;
            }

            panel.webview.postMessage({
              type: 'error',
              message: errorMessage,
              data: errorData,
              headers: (axios.isAxiosError(error) && error.response) ? error.response.headers || {} : {},
              status: (axios.isAxiosError(error) && error.response) ? error.response.status : null,
              statusText: (axios.isAxiosError(error) && error.response) ? error.response.statusText : null
            });
          }
          break;
        }
      }
    });
  });
} 