import * as vscode from 'vscode';
import {
  copyPathLine,
  copyRelativePath,
  copyFullPath,
  copyAsMarkdown,
  copyGitUrl,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('copy-path-line.copy', copyPathLine),
    vscode.commands.registerCommand('copy-path-line.copyAsMarkdown', copyAsMarkdown),
    vscode.commands.registerCommand('copy-path-line.copyRelativePath', copyRelativePath),
    vscode.commands.registerCommand('copy-path-line.copyFullPath', copyFullPath),
    vscode.commands.registerCommand('copy-path-line.copyGitUrl', copyGitUrl),
  );
}

export function deactivate() {}
