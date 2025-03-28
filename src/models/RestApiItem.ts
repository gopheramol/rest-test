import * as vscode from 'vscode';

export class RestApiItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly iconPath?: vscode.ThemeIcon
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
  }
} 