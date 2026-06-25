import * as vscode from 'vscode';
import * as fs from 'fs';
import { CollectionService } from '../services/CollectionService';
import { RestApiTreeProvider } from '../providers/RestApiTreeProvider';
import { RestApiItem } from '../models/RestApiItem';
import { exportToPostman, importFromPostman } from '../utils/postmanCollection';

/**
 * Registers all collection-management commands (create / rename / delete /
 * move / delete request / import / export) and returns their disposables.
 */
export function registerCollectionCommands(
  context: vscode.ExtensionContext,
  treeProvider: RestApiTreeProvider,
  collections: CollectionService
): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = [];

  disposables.push(
    vscode.commands.registerCommand('restApiTest.newCollection', async () => {
      const name = await vscode.window.showInputBox({
        prompt: 'New collection name',
        placeHolder: 'e.g. Billing API'
      });
      if (name && name.trim()) {
        await collections.createCollection(name.trim());
        treeProvider.refresh();
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('restApiTest.renameCollection', async (item?: RestApiItem) => {
      if (!item?.collectionId) { return; }
      const current = collections.getCollection(item.collectionId);
      const name = await vscode.window.showInputBox({
        prompt: 'Rename collection',
        value: current?.name
      });
      if (name && name.trim()) {
        await collections.renameCollection(item.collectionId, name.trim());
        treeProvider.refresh();
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('restApiTest.deleteCollection', async (item?: RestApiItem) => {
      if (!item?.collectionId) { return; }
      const collection = collections.getCollection(item.collectionId);
      if (!collection) { return; }
      const result = await vscode.window.showWarningMessage(
        `Delete collection "${collection.name}" and its ${collection.requests.length} request(s)?`,
        { modal: true },
        'Delete'
      );
      if (result === 'Delete') {
        await collections.deleteCollection(item.collectionId);
        treeProvider.refresh();
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('restApiTest.deleteRequest', async (item?: RestApiItem) => {
      if (!item?.collectionId || !item.requestId) { return; }
      const result = await vscode.window.showWarningMessage(
        `Delete request "${item.label}"?`,
        { modal: true },
        'Delete'
      );
      if (result === 'Delete') {
        await collections.deleteRequest(item.collectionId, item.requestId);
        treeProvider.refresh();
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('restApiTest.moveRequest', async (item?: RestApiItem) => {
      if (!item?.collectionId || !item.requestId) { return; }
      const targets = collections.getCollections().filter(c => c.id !== item.collectionId);
      if (!targets.length) {
        vscode.window.showInformationMessage('No other collection to move this request to.');
        return;
      }
      const pick = await vscode.window.showQuickPick(
        targets.map(c => ({ label: c.name, id: c.id })),
        { placeHolder: 'Move request to collection…' }
      );
      if (pick) {
        await collections.moveRequest(item.requestId, item.collectionId, pick.id);
        treeProvider.refresh();
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('restApiTest.exportCollection', async (item?: RestApiItem) => {
      if (!item?.collectionId) { return; }
      const collection = collections.getCollection(item.collectionId);
      if (!collection) { return; }
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(`${collection.name.replace(/[^\w.-]+/g, '_')}.postman_collection.json`),
        filters: { 'Postman Collection': ['json'], 'All Files': ['*'] }
      });
      if (!uri) { return; }
      try {
        const data = JSON.stringify(exportToPostman(collection), null, 2);
        await fs.promises.writeFile(uri.fsPath, data);
        vscode.window.showInformationMessage(`Exported "${collection.name}" as a Postman collection.`);
      } catch (err) {
        vscode.window.showErrorMessage('Failed to export collection: ' + err);
      }
    })
  );

  disposables.push(
    vscode.commands.registerCommand('restApiTest.importCollection', async () => {
      const uris = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { 'Postman Collection': ['json'], 'All Files': ['*'] }
      });
      if (!uris || !uris.length) { return; }
      try {
        const raw = await fs.promises.readFile(uris[0].fsPath, 'utf8');
        const parsed = importFromPostman(JSON.parse(raw));
        const created = await collections.addImportedCollection({ id: '', ...parsed });
        treeProvider.refresh();
        vscode.window.showInformationMessage(
          `Imported "${created.name}" (${created.requests.length} request(s)).`
        );
      } catch (err: any) {
        vscode.window.showErrorMessage('Failed to import collection: ' + (err?.message || err));
      }
    })
  );

  return disposables;
}
