import * as vscode from 'vscode';

export interface RequestData {
  id: string;
  name: string;
  method: string;
  url: string;
  body: string;
  headers: { key: string; value: string }[];
  queryParams: { key: string; value: string }[];
  createdAt: number;
}

export class HistoryRequestItem extends vscode.TreeItem {
  constructor(
    public readonly request: RequestData,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(request.name, collapsibleState);
    this.tooltip = `${request.method} ${request.url}`;
    this.description = request.method;
    
    // Set the contextValue for right-click menu options
    this.contextValue = 'historyRequest';

    // Set the command to execute when the item is clicked
    this.command = {
      command: 'restApiTest.executeHistoryRequest',
      title: 'Execute Request',
      arguments: [this.request]
    };

    // Store reference to request in the tree item for context menu commands
    this.id = request.id;
    
    // Set the icon based on the HTTP method
    this.setMethodIcon(request.method);
  }

  private setMethodIcon(method: string) {
    switch (method.toUpperCase()) {
      case 'GET':
        this.iconPath = new vscode.ThemeIcon('symbol-method', new vscode.ThemeColor('charts.green'));
        break;
      case 'POST':
        this.iconPath = new vscode.ThemeIcon('symbol-method', new vscode.ThemeColor('charts.blue'));
        break;
      case 'PUT':
        this.iconPath = new vscode.ThemeIcon('symbol-method', new vscode.ThemeColor('charts.orange'));
        break;
      case 'DELETE':
        this.iconPath = new vscode.ThemeIcon('symbol-method', new vscode.ThemeColor('charts.red'));
        break;
      case 'PATCH':
        this.iconPath = new vscode.ThemeIcon('symbol-method', new vscode.ThemeColor('charts.purple'));
        break;
      default:
        this.iconPath = new vscode.ThemeIcon('symbol-method');
    }
  }
} 