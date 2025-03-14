import * as vscode from 'vscode';
import { RestApiItem } from '../models/RestApiItem';
import { HistoryRequestItem, RequestData } from '../models/HistoryRequestItem';
import { HistoryService } from '../services/HistoryService';

export class RestApiTreeProvider implements vscode.TreeDataProvider<RestApiItem | HistoryRequestItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RestApiItem | HistoryRequestItem | undefined | null | void> = new vscode.EventEmitter<RestApiItem | HistoryRequestItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RestApiItem | HistoryRequestItem | undefined | null | void> = this._onDidChangeTreeData.event;
  
  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: RestApiItem | HistoryRequestItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RestApiItem | HistoryRequestItem): Promise<(RestApiItem | HistoryRequestItem)[]> {
    if (element) {
      return Promise.resolve([]);
    }

    const items: (RestApiItem | HistoryRequestItem)[] = [
      // Add section for new request
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

    // Add a section header for history if there are history items
    const historyItems = await HistoryService.getHistory(this.context);
    if (historyItems.length > 0) {
      // Add a divider
      items.push(new RestApiItem(
        'Recent Requests',
        'Your recently sent requests',
        vscode.TreeItemCollapsibleState.Expanded
      ));
      
      // Add history items
      historyItems.forEach(historyItem => {
        items.push(new HistoryRequestItem(historyItem, vscode.TreeItemCollapsibleState.None));
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