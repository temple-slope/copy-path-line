import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('copy-path-line.copy', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor');
      return;
    }

    const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
    const selection = editor.selection;

    let result: string;
    if (selection.start.line === selection.end.line) {
      result = `${relativePath}:${selection.start.line + 1}`;
    } else {
      result = `${relativePath}:${selection.start.line + 1}:${selection.end.line + 1}`;
    }

    await vscode.env.clipboard.writeText(result);
    vscode.window.showInformationMessage(`Copied: ${result}`);
  });
  context.subscriptions.push(command);
}

export function deactivate() {}
