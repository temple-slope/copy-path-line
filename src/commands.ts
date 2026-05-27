import * as vscode from 'vscode';
import { readConfig } from './config';
import {
  formatPathLine,
  formatPath,
  formatFullPath,
  formatMarkdown,
  formatGitUrl,
} from './formatters';
import { getGitInfo } from './git';

const TOAST_PREVIEW_MAX = 80;

function previewForToast(value: string): string {
  const oneLine = value.replace(/\n/g, ' ');
  if (oneLine.length <= TOAST_PREVIEW_MAX) {
    return oneLine;
  }
  return oneLine.slice(0, TOAST_PREVIEW_MAX - 1) + '…';
}

async function tryExitVimVisualMode(editor: vscode.TextEditor): Promise<void> {
  // Heuristic: only fire when there is a non-empty selection. In VSCodeVim,
  // Visual mode always has a non-empty selection; Insert/Normal modes do not.
  // Without this guard, vim_escape would also exit Insert mode mid-typing.
  if (editor.selection.isEmpty) {
    return;
  }
  try {
    await vscode.commands.executeCommand('extension.vim_escape');
  } catch {
    // Vim extension not installed or command unavailable; ignore.
  }
}

async function copyAndNotify(
  value: string,
  editor: vscode.TextEditor,
): Promise<void> {
  await vscode.env.clipboard.writeText(value);
  if (readConfig().exitVisualModeAfterCopy) {
    await tryExitVimVisualMode(editor);
  }
  vscode.window.showInformationMessage(`Copied: ${previewForToast(value)}`);
}

function requireEditor(): vscode.TextEditor | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return undefined;
  }
  return editor;
}

export async function copyPathLine(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const relPath = vscode.workspace.asRelativePath(editor.document.uri);
  const result = formatPathLine(relPath, editor.selection, readConfig());
  await copyAndNotify(result, editor);
}

export async function copyRelativePath(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const relPath = vscode.workspace.asRelativePath(editor.document.uri);
  const result = formatPath(relPath, readConfig());
  await copyAndNotify(result, editor);
}

export async function copyFullPath(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const absPath = editor.document.uri.fsPath;
  const result = formatFullPath(absPath, readConfig());
  await copyAndNotify(result, editor);
}

export async function copyAsMarkdown(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const relPath = vscode.workspace.asRelativePath(editor.document.uri);
  const result = formatMarkdown(
    relPath,
    editor.selection,
    editor.document,
    readConfig(),
  );
  await copyAndNotify(result, editor);
}

export async function copyGitUrl(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const cfg = readConfig();
  const filePath = editor.document.uri.fsPath;
  const info = await getGitInfo(filePath, cfg);
  if (!info.ok) {
    vscode.window.showWarningMessage(`Copy Git URL: ${info.error}`);
    return;
  }
  const result = formatGitUrl(info.value, {
    startLine: editor.selection.start.line + 1,
    endLine: editor.selection.end.line + 1,
  });
  await copyAndNotify(result, editor);
}
