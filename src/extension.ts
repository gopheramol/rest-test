import * as vscode from 'vscode';
import { RestApiTreeProvider } from './providers/RestApiTreeProvider';
import { registerSendRequestCommand } from './commands/sendRequest';

export function activate(context: vscode.ExtensionContext) {
  // Register view container
  const restApiContainer = vscode.window.createTreeView('restApiTesterView', {
    treeDataProvider: new RestApiTreeProvider(),
    showCollapseAll: true
  });

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('restApiTesterView', new RestApiTreeProvider())
  );

  // Register commands
  context.subscriptions.push(registerSendRequestCommand(context));
}

export function deactivate() {}