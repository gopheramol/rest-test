import * as vscode from 'vscode';
import { RestApiItem } from '../models/RestApiItem.js';

export class RestApiTreeProvider implements vscode.TreeDataProvider<RestApiItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RestApiItem | undefined | null | void> = new vscode.EventEmitter<RestApiItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RestApiItem | undefined | null | void> = this._onDidChangeTreeData.event;

  getTreeItem(element: RestApiItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RestApiItem): Thenable<RestApiItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    const items = [
      new RestApiItem(
        'New Request',
        'Send a new API request',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'restApiTest.sendRequest',
          title: 'Send Request',
          arguments: []
        }
      )
    ];

    return Promise.resolve(items);
  }
} 