import * as vscode from 'vscode';

export class RestApiItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
  }

  iconPath = new vscode.ThemeIcon('arrow-right');
} 