import * as vscode from 'vscode';
import axios from 'axios';
import { getWebviewContent } from '../webviews/apiRequestWebview';
import { generateCurlCommand } from '../utils/curlGenerator';
import { RestApiTreeProvider } from '../providers/RestApiTreeProvider';

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
        retainContextWhenHidden: true
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

    panel.webview.html = getWebviewContent(storedState);

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
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

        case 'sendRequest': {
          const { method, url, body, headers, queryParams } = message;
          try {
            console.log('Sending request:', { method, url, body, headers, queryParams });
            
            const urlObj = new URL(url);
            
            // Process query parameters correctly
            if (queryParams && Array.isArray(queryParams)) {
              queryParams.forEach((param: { key: string; value: string }) => {
                if (param.key && param.value) {
                  urlObj.searchParams.append(param.key, param.value);
                }
              });
            } else if (queryParams && typeof queryParams === 'object') {
              Object.entries(queryParams).forEach(([key, value]) => {
                if (key && value) {
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

            const startTime = Date.now();
            const response = await axios({
              method: method.toLowerCase(),
              url: urlObj.toString(),
              data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
              headers: processedHeaders,
              timeout: 30000, // 30 second timeout
            });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            console.log('Response received:', { 
              status: response.status, 
              statusText: response.statusText, 
              data: response.data,
              responseTime 
            });

            // Send response data without double-stringifying
            panel.webview.postMessage({
              type: 'response',
              status: response.status,
              statusText: response.statusText,
              data: response.data, // Send raw data, let frontend handle formatting
              responseTime: responseTime,
              headers: response.headers || {}
            });
          } catch (error) {
            console.error('Request error:', error);
            
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
              headers: (axios.isAxiosError(error) && error.response) ? error.response.headers || {} : {}
            });
          }
          break;
        }
      }
    });
  });
} 