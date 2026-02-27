import * as vscode from 'vscode';
import { RestApiTreeProvider } from './providers/RestApiTreeProvider';
import { registerSendRequestCommand } from './commands/sendRequest';

export function activate(context: vscode.ExtensionContext) {
  // Create the tree provider with the context
  const treeProvider = new RestApiTreeProvider(context);
  
  // Register view container
  const restApiContainer = vscode.window.createTreeView('restApiTesterView', {
    treeDataProvider: treeProvider
  });
  
  context.subscriptions.push(restApiContainer);

  // Register commands
  context.subscriptions.push(registerSendRequestCommand(context, treeProvider));
  
  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('restApiTest.refreshView', () => {
      treeProvider.refresh();
    })
  );
}

export function deactivate() {}