import * as vscode from 'vscode';

export class RestApiItem extends vscode.TreeItem {
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

    // Enhanced visual properties for smoother UI
    this.resourceUri = undefined; // Can be used for custom styling
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
   * Create a saved requests parent item
   */
  static createSavedRequestsParent(count: number): RestApiItem {
    return new RestApiItem(
      'Saved Requests',
      `${count} saved request${count === 1 ? '' : 's'}`,
      vscode.TreeItemCollapsibleState.Expanded,
      undefined,
      new vscode.ThemeIcon('bookmark', new vscode.ThemeColor('charts.blue')),
      'saved-requests'
    );
  }

  /**
   * Create a saved request item with method-specific styling
   */
  static createSavedRequestItem(request: any): RestApiItem {
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

    return new RestApiItem(
      request.name,
      `${request.method} ${request.url}`,
      vscode.TreeItemCollapsibleState.None,
      {
        command: 'restApiTest.sendRequest',
        title: 'Send Request',
        arguments: [request]
      },
      new vscode.ThemeIcon('symbol-method', iconColor),
      'saved-request'
    );
  }
} 