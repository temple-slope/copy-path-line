import type { Selection, TextDocument } from 'vscode';
import type { FormatConfig } from './config';

function prefix(cfg: FormatConfig): string {
  return cfg.atPrefix ? '@' : '';
}

function separator(cfg: FormatConfig): string {
  return cfg.rangeSeparator === 'colon' ? ':' : '-';
}

function lineSuffix(selection: Selection, cfg: FormatConfig): string {
  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;
  if (startLine === endLine) {
    return `:${startLine}`;
  }
  return `:${startLine}${separator(cfg)}${endLine}`;
}

export function formatPathLine(relPath: string, selection: Selection, cfg: FormatConfig): string {
  return `${prefix(cfg)}${relPath}${lineSuffix(selection, cfg)}`;
}

export function formatPath(relPath: string, cfg: FormatConfig): string {
  return `${prefix(cfg)}${relPath}`;
}

export function formatFullPath(absPath: string, cfg: FormatConfig): string {
  return `${prefix(cfg)}${absPath}`;
}

export function formatMarkdown(
  relPath: string,
  selection: Selection,
  document: TextDocument,
  cfg: FormatConfig,
): string {
  const pathLabel = formatPathLine(relPath, selection, cfg);
  const language = document.languageId ?? '';

  let code: string;
  if (selection.isEmpty) {
    code = document.lineAt(selection.start.line).text;
  } else {
    code = document.getText(selection);
  }

  return `${pathLabel}\n\`\`\`${language}\n${code}\n\`\`\``;
}
