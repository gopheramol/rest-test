import * as vscode from 'vscode';
import { HistoryService } from '../services/HistoryService';
import { RequestData } from '../models/HistoryRequestItem';
import { getWebviewContent } from '../webviews/apiRequestWebview';
import { RestApiTreeProvider } from '../providers/RestApiTreeProvider';
import axios from 'axios';
import { generateCurlCommand } from '../utils/curlGenerator';

/**
 * Register all history-related commands
 */
export function registerHistoryCommands(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider
): vscode.Disposable[] {
  return [
    registerExecuteHistoryRequestCommand(context, treeProvider),
    registerRenameHistoryRequestCommand(context, treeProvider),
    registerDeleteHistoryRequestCommand(context, treeProvider),
    registerClearHistoryCommand(context, treeProvider)
  ];
}

/**
 * Registers a command to execute a request from history
 */
function registerExecuteHistoryRequestCommand(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider
): vscode.Disposable {
  return vscode.commands.registerCommand('restApiTest.executeHistoryRequest', async (request: RequestData) => {
    const panel = vscode.window.createWebviewPanel(
      'restApiTest',
      `REST TEST - ${request.name}`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    panel.webview.html = getWebviewContent(request);
    
    // Handle messages from the webview
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
          
        case 'saveToHistory': {
          const { method, url, body, headers, queryParams, name } = message.state;
          await HistoryService.addToHistory(context, {
            name: name || `${method} ${url}`,
            method,
            url,
            body,
            headers,
            queryParams
          });
          treeProvider.refresh();
          return;
        }
        
        case 'sendRequest': {
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

            // Add this request to history automatically
            await HistoryService.addToHistory(context, {
              name: `${method} ${url}`,
              method,
              url,
              body,
              headers: message.headersList || [],
              queryParams: message.queryParamsList || []
            });
            treeProvider.refresh();

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
      }
    });
  });
}

/**
 * Registers a command to rename a request in history
 */
function registerRenameHistoryRequestCommand(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider
): vscode.Disposable {
  return vscode.commands.registerCommand('restApiTest.renameHistoryRequest', async (item) => {
    // When called from tree view context menu, we might get a TreeItem instead of RequestData
    // Try to find the request data from the id if necessary
    let requestData: RequestData | undefined;
    let requestId: string | undefined;
    
    if (!item) {
      // No item was passed, something is wrong
      vscode.window.showErrorMessage('Cannot rename: No item selected');
      return;
    } else if ('request' in item) {
      // Direct RequestData object passed (e.g., from our code)
      requestData = item.request;
      requestId = requestData?.id;  // Use optional chaining to avoid error
    } else if ('id' in item) {
      // TreeItem with id passed (from context menu)
      requestId = item.id;
      // Fetch the request data from history using the ID
      const history = await HistoryService.getHistory(context);
      requestData = history.find(req => req.id === requestId);
    } else {
      vscode.window.showErrorMessage('Cannot rename: Invalid item format');
      return;
    }
    
    // If we couldn't find request data or requestId, show an error
    if (!requestData || !requestId) {
      vscode.window.showErrorMessage('Cannot rename: Request data not found');
      return;
    }

    // Now TypeScript knows requestData and requestId can't be undefined
    const request = requestData; // Clear reference for TypeScript
    const id = requestId; // Clear reference for TypeScript

    const newName = await vscode.window.showInputBox({
      prompt: 'Enter a new name for this request',
      value: request.name,
      validateInput: (value) => {
        return value.trim() ? null : 'Name cannot be empty';
      }
    });

    if (newName && newName !== request.name) {
      await HistoryService.updateHistoryItem(context, id, { name: newName });
      treeProvider.refresh();
      vscode.window.showInformationMessage(`Request renamed to "${newName}"`);
    }
  });
}

/**
 * Registers a command to delete a request from history
 */
function registerDeleteHistoryRequestCommand(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider
): vscode.Disposable {
  return vscode.commands.registerCommand('restApiTest.deleteHistoryRequest', async (item) => {
    // When called from tree view context menu, we might get a TreeItem instead of RequestData
    // Try to find the request data from the id if necessary
    let requestData: RequestData | undefined;
    let requestId: string | undefined;
    
    if (!item) {
      // No item was passed, something is wrong
      vscode.window.showErrorMessage('Cannot delete: No item selected');
      return;
    } else if ('request' in item) {
      // Direct RequestData object passed (e.g., from our code)
      requestData = item.request;
      requestId = requestData?.id;  // Use optional chaining to avoid error
    } else if ('id' in item) {
      // TreeItem with id passed (from context menu)
      requestId = item.id;
      // Fetch the request data from history using the ID
      const history = await HistoryService.getHistory(context);
      requestData = history.find(req => req.id === requestId);
    } else {
      vscode.window.showErrorMessage('Cannot delete: Invalid item format');
      return;
    }
    
    // If we couldn't find request data or requestId, show an error
    if (!requestData || !requestId) {
      vscode.window.showErrorMessage('Cannot delete: Request data not found');
      return;
    }

    // Now TypeScript knows requestData and requestId can't be undefined
    const request = requestData; // Clear reference for TypeScript
    const id = requestId; // Clear reference for TypeScript
    
    const confirmed = await vscode.window.showWarningMessage(
      `Are you sure you want to delete "${request.name}"?`,
      { modal: true },
      'Delete'
    );

    if (confirmed === 'Delete') {
      await HistoryService.removeFromHistory(context, id);
      treeProvider.refresh();
      vscode.window.showInformationMessage(`Request "${request.name}" was deleted`);
    }
  });
}

/**
 * Registers a command to clear all history
 */
function registerClearHistoryCommand(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider
): vscode.Disposable {
  return vscode.commands.registerCommand('restApiTest.clearHistory', async () => {
    const confirmed = await vscode.window.showWarningMessage(
      'Are you sure you want to clear all request history?',
      { modal: true },
      'Clear All'
    );

    if (confirmed === 'Clear All') {
      await HistoryService.clearHistory(context);
      treeProvider.refresh();
      vscode.window.showInformationMessage('Request history cleared');
    }
  });
} 