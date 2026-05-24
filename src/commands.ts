import * as vscode from 'vscode';
import { readConfig } from './config';
import {
  formatPathLine,
  formatPath,
  formatFullPath,
  formatMarkdown,
} from './formatters';

const TOAST_PREVIEW_MAX = 80;

function previewForToast(value: string): string {
  const oneLine = value.replace(/\n/g, ' ');
  if (oneLine.length <= TOAST_PREVIEW_MAX) {
    return oneLine;
  }
  return oneLine.slice(0, TOAST_PREVIEW_MAX - 1) + '…';
}

async function tryExitVimVisualMode(): Promise<void> {
  try {
    await vscode.commands.executeCommand('extension.vim_escape');
  } catch {
    // Vim extension not installed or command unavailable; ignore.
  }
}

async function copyAndNotify(value: string): Promise<void> {
  await vscode.env.clipboard.writeText(value);
  if (readConfig().exitVisualModeAfterCopy) {
    await tryExitVimVisualMode();
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
  await copyAndNotify(result);
}

export async function copyRelativePath(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const relPath = vscode.workspace.asRelativePath(editor.document.uri);
  const result = formatPath(relPath, readConfig());
  await copyAndNotify(result);
}

export async function copyFullPath(): Promise<void> {
  const editor = requireEditor();
  if (!editor) {
    return;
  }
  const absPath = editor.document.uri.fsPath;
  const result = formatFullPath(absPath, readConfig());
  await copyAndNotify(result);
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
  await copyAndNotify(result);
}
