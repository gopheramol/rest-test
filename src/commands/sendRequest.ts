import * as vscode from 'vscode';
import axios from 'axios';
import { getWebviewContent } from '../webviews/apiRequestWebview';
import { generateCurlCommand } from '../utils/curlGenerator';

/**
 * Handler for the sendRequest command
 */
export function registerSendRequestCommand(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand('restApiTest.sendRequest', async () => {
    const panel = vscode.window.createWebviewPanel(
      'restApiTest',
      'REST TEST',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    const storedState = context.globalState.get('restApiTesterState', {
      method: 'GET',
      url: '',
      body: '',
      headers: [{ key: '', value: '' }],
      queryParams: [{ key: '', value: '' }]
    });

    panel.webview.html = getWebviewContent(storedState);

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'saveState':
          await context.globalState.update('restApiTesterState', message.state);
          return;

        case 'copyToClipboard':
          await vscode.env.clipboard.writeText(message.text);
          panel.webview.postMessage({
            type: 'copySuccess',
            source: 'response'
          });
          return;

        case 'copyAsCurl':
          const curlCommand = generateCurlCommand(message);
          await vscode.env.clipboard.writeText(curlCommand);
          panel.webview.postMessage({
            type: 'copySuccess',
            source: 'curl'
          });
          return;

        case 'sendRequest':
          const { method, url, body, headers, queryParams } = message;
          try {
            const urlObj = new URL(url);
            if (queryParams) {
              Object.entries(queryParams).forEach(([key, value]) => {
                if (value) {
                  urlObj.searchParams.append(key, value as string);
                }
              });
            }

            const startTime = Date.now();
            const response = await axios({
              method: method.toLowerCase(),
              url: urlObj.toString(),
              data: body ? JSON.parse(body) : undefined,
              headers: headers || {},
            });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            panel.webview.postMessage({
              type: 'response',
              status: response.status,
              statusText: response.statusText,
              data: JSON.stringify(response.data, null, 2),
              responseTime: responseTime
            });
          } catch (error) {
            let errorMessage = 'An unknown error occurred.';
            let errorData = null;
            
            if (axios.isAxiosError(error)) {
              if (error.response) {
                errorMessage = `Status: ${error.response.status} - ${error.response.statusText}`;
                
                // Format error response data if it exists
                if (error.response.data) {
                  try {
                    errorData = typeof error.response.data === 'string' 
                      ? JSON.parse(error.response.data) 
                      : error.response.data;
                    errorData = JSON.stringify(errorData, null, 2);
                  } catch {
                    errorData = String(error.response.data);
                  }
                }
              } else if (error.request) {
                errorMessage = 'No response received from server';
              } else {
                errorMessage = error.message;
              }
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }
            
            panel.webview.postMessage({
              type: 'error',
              message: errorMessage,
              data: errorData
            });
          }
          break;
      }
    });
  });
} 