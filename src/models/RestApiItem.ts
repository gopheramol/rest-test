import * as vscode from 'vscode';
import { Collection, SavedRequest } from '../services/CollectionService';

export class RestApiItem extends vscode.TreeItem {
  /** Set on collection nodes and on saved-request nodes (their parent). */
  public collectionId?: string;
  /** Set on saved-request nodes. */
  public requestId?: string;
  /** The full saved request, set on saved-request nodes. */
  public request?: SavedRequest;

  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly iconPath?: vscode.ThemeIcon,
    public readonly contextValue?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = description;
    this.description = description;

    if (command) {
      this.command = command;
    }

    if (iconPath) {
      this.iconPath = iconPath;
    }

    if (contextValue) {
      this.contextValue = contextValue;
    }
  }

  /**
   * Create a new request item with enhanced styling
   */
  static createNewRequestItem(): RestApiItem {
    return new RestApiItem(
      'New Request',
      'Send a new API request',
      vscode.TreeItemCollapsibleState.None,
      {
        command: 'restApiTest.sendRequest',
        title: 'Send Request',
        arguments: []
      },
      new vscode.ThemeIcon('add', new vscode.ThemeColor('charts.green')),
      'new-request'
    );
  }

  /**
   * Create a collection (folder) node.
   */
  static createCollectionItem(collection: Collection): RestApiItem {
    const count = collection.requests.length;
    const item = new RestApiItem(
      collection.name,
      `${count} request${count === 1 ? '' : 's'}`,
      vscode.TreeItemCollapsibleState.Expanded,
      undefined,
      new vscode.ThemeIcon('folder', new vscode.ThemeColor('charts.blue')),
      'collection'
    );
    item.collectionId = collection.id;
    return item;
  }

  /**
   * Create a saved request item with method-specific styling.
   */
  static createSavedRequestItem(request: SavedRequest, collectionId: string): RestApiItem {
    let iconColor: vscode.ThemeColor;
    switch ((request.method || '').toUpperCase()) {
      case 'GET':
        iconColor = new vscode.ThemeColor('charts.green');
        break;
      case 'POST':
        iconColor = new vscode.ThemeColor('charts.blue');
        break;
      case 'PUT':
        iconColor = new vscode.ThemeColor('charts.orange');
        break;
      case 'DELETE':
        iconColor = new vscode.ThemeColor('charts.red');
        break;
      case 'PATCH':
        iconColor = new vscode.ThemeColor('charts.purple');
        break;
      default:
        iconColor = new vscode.ThemeColor('charts.gray');
    }

    const item = new RestApiItem(
      request.name,
      `${request.method} ${request.url}`,
      vscode.TreeItemCollapsibleState.None,
      {
        command: 'restApiTest.sendRequest',
        title: 'Send Request',
        arguments: [request, collectionId]
      },
      new vscode.ThemeIcon('symbol-method', iconColor),
      'saved-request'
    );
    item.collectionId = collectionId;
    item.requestId = request.id;
    item.request = request;
    return item;
  }
}
