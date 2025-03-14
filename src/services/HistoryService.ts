import * as vscode from 'vscode';
import { RequestData } from '../models/HistoryRequestItem';

export class HistoryService {
  private static readonly HISTORY_KEY = 'restApiTesterHistory';

  /**
   * Gets all stored history items
   */
  static async getHistory(context: vscode.ExtensionContext): Promise<RequestData[]> {
    const history = context.globalState.get<RequestData[]>(this.HISTORY_KEY, []);
    return history.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
  }

  /**
   * Checks if a request is a duplicate of an existing one
   * @returns The existing request if a duplicate is found, undefined otherwise
   */
  private static findDuplicate(history: RequestData[], newRequest: Omit<RequestData, 'id' | 'createdAt'>): RequestData | undefined {
    return history.find(item => {
      // Compare essential properties to determine if it's a duplicate
      const sameMethod = item.method === newRequest.method;
      const sameUrl = item.url === newRequest.url;
      const sameBody = item.body === newRequest.body;
      
      // Compare headers (order doesn't matter)
      const sameHeaders = this.areHeadersEqual(item.headers, newRequest.headers);
      
      // Compare query params (order doesn't matter)
      const sameQueryParams = this.areParamsEqual(item.queryParams, newRequest.queryParams);
      
      return sameMethod && sameUrl && sameBody && sameHeaders && sameQueryParams;
    });
  }
  
  /**
   * Compare two arrays of headers or params to check if they're equal
   */
  private static areHeadersEqual(
    arr1: { key: string; value: string }[],
    arr2: { key: string; value: string }[]
  ): boolean {
    // If lengths are different, they can't be equal
    if (arr1.length !== arr2.length) {
      return false;
    }
    
    // Filter out empty items
    const filtered1 = arr1.filter(h => h.key.trim() !== '' || h.value.trim() !== '');
    const filtered2 = arr2.filter(h => h.key.trim() !== '' || h.value.trim() !== '');
    
    // If filtered lengths are different, they can't be equal
    if (filtered1.length !== filtered2.length) {
      return false;
    }
    
    // Check if all items in arr1 have a matching item in arr2
    return filtered1.every(item1 => {
      return filtered2.some(item2 => 
        item1.key.trim() === item2.key.trim() && 
        item1.value.trim() === item2.value.trim()
      );
    });
  }
  
  /**
   * Compare two arrays of query parameters to check if they're equal
   */
  private static areParamsEqual(
    arr1: { key: string; value: string }[],
    arr2: { key: string; value: string }[]
  ): boolean {
    return this.areHeadersEqual(arr1, arr2);
  }

  /**
   * Adds a new request to history, avoiding duplicates
   */
  static async addToHistory(context: vscode.ExtensionContext, request: Omit<RequestData, 'id' | 'createdAt'>): Promise<RequestData> {
    const history = await this.getHistory(context);
    
    // Check if this request is a duplicate
    const existingRequest = this.findDuplicate(history, request);
    
    if (existingRequest) {
      // If duplicate found, update its timestamp to bring it to the top
      await this.updateHistoryItem(context, existingRequest.id, { 
        createdAt: Date.now(),
        // Update name if provided (allows renaming when re-executing)
        ...(request.name !== existingRequest.name ? { name: request.name } : {})
      });
      
      // Return the existing request
      return existingRequest;
    }
    
    // If not a duplicate, create a new request with ID and timestamp
    const newRequest: RequestData = {
      ...request,
      id: this.generateId(),
      createdAt: Date.now()
    };
    
    // Add to history (limit to 50 items)
    const updatedHistory = [newRequest, ...history].slice(0, 50);
    await context.globalState.update(this.HISTORY_KEY, updatedHistory);
    
    return newRequest;
  }
  
  /**
   * Removes a request from history
   */
  static async removeFromHistory(context: vscode.ExtensionContext, id: string): Promise<boolean> {
    const history = await this.getHistory(context);
    const updatedHistory = history.filter(req => req.id !== id);
    
    if (updatedHistory.length === history.length) {
      return false; // Item not found
    }
    
    await context.globalState.update(this.HISTORY_KEY, updatedHistory);
    return true;
  }
  
  /**
   * Updates a request in history
   */
  static async updateHistoryItem(context: vscode.ExtensionContext, id: string, updates: Partial<RequestData>): Promise<boolean> {
    const history = await this.getHistory(context);
    const itemIndex = history.findIndex(req => req.id === id);
    
    if (itemIndex === -1) {
      return false; // Item not found
    }
    
    // Update the item
    history[itemIndex] = { ...history[itemIndex], ...updates };
    await context.globalState.update(this.HISTORY_KEY, history);
    return true;
  }
  
  /**
   * Clears all history
   */
  static async clearHistory(context: vscode.ExtensionContext): Promise<void> {
    await context.globalState.update(this.HISTORY_KEY, []);
  }
  
  /**
   * Generates a unique ID for a request
   */
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
} 