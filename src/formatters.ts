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

function fenceFor(code: string): string {
  // CommonMark: a fenced block's closing delimiter must be at least as long as
  // the opening, and any backtick run inside the body must be shorter than the
  // fence. Pick fence length = max(3, longest backtick run + 1).
  let maxRun = 0;
  let currentRun = 0;
  for (const ch of code) {
    if (ch === '`') {
      currentRun++;
      if (currentRun > maxRun) {
        maxRun = currentRun;
      }
    } else {
      currentRun = 0;
    }
  }
  return '`'.repeat(Math.max(3, maxRun + 1));
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

  const fence = fenceFor(code);
  return `${pathLabel}\n${fence}${language}\n${code}\n${fence}`;
}
