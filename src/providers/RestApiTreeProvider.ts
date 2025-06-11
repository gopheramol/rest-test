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
  
  private isRefreshing: boolean = false;
  private lastRefreshTime: number = 0;
  
  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: RestApiItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RestApiItem): Promise<RestApiItem[]> {
    if (!element) {
      // Root level items with enhanced animation support
      const items: RestApiItem[] = [];

      // Add section for new request with enhanced styling
      items.push(RestApiItem.createNewRequestItem());

      // Add saved requests section with smooth loading
      const savedRequests = this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);
      if (savedRequests.length > 0) {
        items.push(RestApiItem.createSavedRequestsParent(savedRequests.length));
      }

      // Simulate smooth loading for better UX (only on first load or after significant changes)
      const now = Date.now();
      if (now - this.lastRefreshTime > 1000) {
        await this.simulateProgressiveLoading();
        this.lastRefreshTime = now;
      }

      return Promise.resolve(items);
    } else if (element.contextValue === 'saved-requests') {
      // Children of "Saved Requests" node with staggered loading animation
      const savedRequests = this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);
      
      const requestItems = savedRequests.map(request => 
        RestApiItem.createSavedRequestItem(request)
      );

      // Add subtle delay for smooth expansion animation
      if (requestItems.length > 3) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return Promise.resolve(requestItems);
    }

    // For other elements that don't have children
    return Promise.resolve([]);
  }

  /**
   * Refresh the tree view with smooth animation
   */
  refresh(): void {
    if (this.isRefreshing) {
      return; // Prevent multiple simultaneous refreshes
    }

    this.isRefreshing = true;
    
    // Show progress indicator for longer operations
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: "Refreshing API requests...",
        cancellable: false
      },
      async (progress) => {
        progress.report({ increment: 0 });
        
        // Simulate smooth refresh with progress
        for (let i = 0; i <= 100; i += 25) {
          progress.report({ 
            increment: 25, 
            message: i < 100 ? `Loading... ${i}%` : "Complete!" 
          });
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        this._onDidChangeTreeData.fire();
        this.isRefreshing = false;
      }
    );
  }

  /**
   * Refresh specific item with animation
   */
  refreshItem(item?: RestApiItem): void {
    this._onDidChangeTreeData.fire(item);
  }

  /**
   * Add a new saved request with smooth animation feedback
   */
  async addSavedRequest(request: SavedRequest): Promise<void> {
    const savedRequests = this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);
    
    // Add with smooth feedback
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Saving "${request.name}"...`,
        cancellable: false
      },
      async (progress) => {
        progress.report({ increment: 0 });
        
        // Simulate save process for smooth UX
        progress.report({ increment: 50, message: "Validating request..." });
        await new Promise(resolve => setTimeout(resolve, 100));
        
        savedRequests.push(request);
        await this.context.globalState.update('restApiTesterSavedRequests', savedRequests);
        
        progress.report({ increment: 100, message: "Saved successfully!" });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        this.refresh();
        
        // Show success message with icon
        vscode.window.showInformationMessage(
          `✅ Request "${request.name}" saved successfully!`,
          'View Requests'
        ).then(selection => {
          if (selection === 'View Requests') {
            vscode.commands.executeCommand('restApiTesterView.focus');
          }
        });
      }
    );
  }

  /**
   * Remove a saved request with smooth animation
   */
  async removeSavedRequest(requestName: string): Promise<void> {
    const result = await vscode.window.showWarningMessage(
      `Are you sure you want to delete "${requestName}"?`,
      { modal: true },
      'Delete',
      'Cancel'
    );

    if (result === 'Delete') {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Deleting "${requestName}"...`,
          cancellable: false
        },
        async (progress) => {
          progress.report({ increment: 0 });
          
          const savedRequests = this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);
          const updatedRequests = savedRequests.filter(req => req.name !== requestName);
          
          progress.report({ increment: 50, message: "Removing..." });
          await new Promise(resolve => setTimeout(resolve, 150));
          
          await this.context.globalState.update('restApiTesterSavedRequests', updatedRequests);
          
          progress.report({ increment: 100, message: "Deleted!" });
          await new Promise(resolve => setTimeout(resolve, 100));
          
          this.refresh();
          
          vscode.window.showInformationMessage(`🗑️ "${requestName}" deleted successfully!`);
        }
      );
    }
  }

  /**
   * Simulate progressive loading for smooth UX
   */
  private async simulateProgressiveLoading(): Promise<void> {
    // Only add delay for better perceived performance on slower operations
    if (this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []).length > 5) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Get all saved requests
   */
  getSavedRequests(): SavedRequest[] {
    return this.context.globalState.get<SavedRequest[]>('restApiTesterSavedRequests', []);
  }

  /**
   * Clear all saved requests with confirmation
   */
  async clearAllRequests(): Promise<void> {
    const requests = this.getSavedRequests();
    if (requests.length === 0) {
      vscode.window.showInformationMessage('No saved requests to clear.');
      return;
    }

    const result = await vscode.window.showWarningMessage(
      `Are you sure you want to delete all ${requests.length} saved requests?`,
      { modal: true },
      'Delete All',
      'Cancel'
    );

    if (result === 'Delete All') {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Clearing all requests...`,
          cancellable: false
        },
        async (progress) => {
          progress.report({ increment: 0 });
          
          for (let i = 0; i <= 100; i += 20) {
            progress.report({ 
              increment: 20, 
              message: i < 100 ? `Clearing... ${i}%` : "Complete!" 
            });
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          await this.context.globalState.update('restApiTesterSavedRequests', []);
          this.refresh();
          
          vscode.window.showInformationMessage(`🧹 All requests cleared successfully!`);
        }
      );
    }
  }
} 