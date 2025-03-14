import * as vscode from 'vscode';
import { RestApiTreeProvider } from './providers/RestApiTreeProvider';
import { registerSendRequestCommand } from './commands/sendRequest';
import { registerHistoryCommands } from './commands/historyCommands';

export function activate(context: vscode.ExtensionContext) {
  // Create the tree provider with the context
  const treeProvider = new RestApiTreeProvider(context);
  
  // Register view container
  const restApiContainer = vscode.window.createTreeView('restApiTesterView', {
    treeDataProvider: treeProvider,
    showCollapseAll: true
  });
  
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('restApiTesterView', treeProvider)
  );

  // Register commands
  context.subscriptions.push(registerSendRequestCommand(context, treeProvider));
  
  // Register history commands
  context.subscriptions.push(...registerHistoryCommands(context, treeProvider));
  
  // Register context menu commands
  context.subscriptions.push(
    vscode.commands.registerCommand('restApiTest.refreshView', () => {
      treeProvider.refresh();
    })
  );
}

export function deactivate() {}