import * as vscode from 'vscode';
import { RestApiItem } from '../models/RestApiItem';
import { CollectionService } from '../services/CollectionService';

const REQUEST_MIME = 'application/vnd.resttest.request';

interface DragPayload {
  requestId: string;
  collectionId: string;
}

export class RestApiTreeProvider
  implements vscode.TreeDataProvider<RestApiItem>, vscode.TreeDragAndDropController<RestApiItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<RestApiItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  // Drag & drop wiring.
  readonly dragMimeTypes = [REQUEST_MIME];
  readonly dropMimeTypes = [REQUEST_MIME];

  constructor(private context: vscode.ExtensionContext, private collections: CollectionService) {}

  getTreeItem(element: RestApiItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RestApiItem): Promise<RestApiItem[]> {
    if (!element) {
      const items: RestApiItem[] = [RestApiItem.createNewRequestItem()];
      for (const collection of this.collections.getCollections()) {
        items.push(RestApiItem.createCollectionItem(collection));
      }
      return items;
    }

    if (element.contextValue === 'collection' && element.collectionId) {
      const collection = this.collections.getCollection(element.collectionId);
      if (!collection) {
        return [];
      }
      return collection.requests.map(req =>
        RestApiItem.createSavedRequestItem(req, collection.id)
      );
    }

    return [];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  // ----- Drag & drop -----

  handleDrag(source: RestApiItem[], dataTransfer: vscode.DataTransfer): void {
    const payload: DragPayload[] = source
      .filter(item => item.contextValue === 'saved-request' && item.requestId && item.collectionId)
      .map(item => ({ requestId: item.requestId!, collectionId: item.collectionId! }));
    if (payload.length) {
      dataTransfer.set(REQUEST_MIME, new vscode.DataTransferItem(payload));
    }
  }

  async handleDrop(target: RestApiItem | undefined, dataTransfer: vscode.DataTransfer): Promise<void> {
    const transferItem = dataTransfer.get(REQUEST_MIME);
    if (!transferItem) {
      return;
    }
    const payload = transferItem.value as DragPayload[];
    if (!Array.isArray(payload) || !payload.length) {
      return;
    }

    // Resolve the destination collection and (optional) insertion index.
    let toCollectionId: string | undefined;
    let targetIndex: number | undefined;

    if (!target) {
      return; // Dropped on empty space — ignore.
    }

    if (target.contextValue === 'collection') {
      toCollectionId = target.collectionId;
    } else if (target.contextValue === 'saved-request' && target.collectionId) {
      toCollectionId = target.collectionId;
      const collection = this.collections.getCollection(toCollectionId);
      if (collection) {
        const idx = collection.requests.findIndex(r => r.id === target.requestId);
        targetIndex = idx === -1 ? undefined : idx;
      }
    }

    if (!toCollectionId) {
      return;
    }

    for (const entry of payload) {
      await this.collections.moveRequest(entry.requestId, entry.collectionId, toCollectionId, targetIndex);
    }
    this.refresh();
  }
}
