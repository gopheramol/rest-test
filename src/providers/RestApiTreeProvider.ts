import * as vscode from 'vscode';
import { RestApiItem } from '../models/RestApiItem';

interface SavedRequest {
  name: string;
  method: string;
  url: string;
  body: string;
  headers: { key: string; value: string }[];
  queryParams: { key: string; value: string }[];
}

export class RestApiTreeProvider implements vscode.TreeDataProvider<RestApiItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RestApiItem | undefined | null | void> = new vscode.EventEmitter<RestApiItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RestApiItem | undefined | null | void> = this._onDidChangeTreeData.event;
  
  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: RestApiItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RestApiItem): Promise<RestApiItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    const items: RestApiItem[] = [
      // Add section for new request with plus icon
      new RestApiItem(
        'New Request',
        'Send a new API request',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'restApiTest.sendRequest',
          title: 'Send Request',
          arguments: []
        },
        new vscode.ThemeIcon('add', new vscode.ThemeColor('charts.green'))
      )
    ];

    // Add saved requests section with bookmark icon
    const savedRequests = this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);
    if (savedRequests.length > 0) {
      // Add a divider with bookmark icon
      items.push(new RestApiItem(
        'Saved Requests',
        'Your saved API requests',
        vscode.TreeItemCollapsibleState.Expanded,
        undefined,
        new vscode.ThemeIcon('bookmark', new vscode.ThemeColor('charts.blue'))
      ));
      
      // Add saved requests with method-specific icons
      savedRequests.forEach(request => {
        let iconColor: vscode.ThemeColor;
        switch (request.method.toUpperCase()) {
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

        items.push(new RestApiItem(
          request.name,
          `${request.method} ${request.url}`,
          vscode.TreeItemCollapsibleState.None,
          {
            command: 'restApiTest.sendRequest',
            title: 'Send Request',
            arguments: [request]
          },
          new vscode.ThemeIcon('symbol-method', iconColor)
        ));
      });
    }

    return Promise.resolve(items);
  }

  /**
   * Refresh the tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
} 