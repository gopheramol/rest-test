import * as vscode from 'vscode';
import { RestApiTreeProvider } from './providers/RestApiTreeProvider';
import { registerSendRequestCommand } from './commands/sendRequest';
import { registerCollectionCommands } from './commands/collectionCommands';
import { CollectionService } from './services/CollectionService';

export async function activate(context: vscode.ExtensionContext) {
  // Collections own all saved requests; migrate any legacy flat list first.
  const collectionService = new CollectionService(context);
  await collectionService.migrate();

  // Create the tree provider (also acts as the drag & drop controller).
  const treeProvider = new RestApiTreeProvider(context, collectionService);

  const restApiContainer = vscode.window.createTreeView('restApiTesterView', {
    treeDataProvider: treeProvider,
    dragAndDropController: treeProvider
  });
  context.subscriptions.push(restApiContainer);

  // Register commands
  context.subscriptions.push(registerSendRequestCommand(context, treeProvider, collectionService));

  context.subscriptions.push(
    vscode.commands.registerCommand('restApiTest.refreshView', () => {
      treeProvider.refresh();
    })
  );

  context.subscriptions.push(...registerCollectionCommands(context, treeProvider, collectionService));
}

export function deactivate() {}
