import * as vscode from 'vscode';

export type RangeSeparator = 'dash' | 'colon';

export interface FormatConfig {
  atPrefix: boolean;
  rangeSeparator: RangeSeparator;
  exitVisualModeAfterCopy: boolean;
}

export function readConfig(): FormatConfig {
  const cfg = vscode.workspace.getConfiguration('copy-path-line');
  const atPrefix = cfg.get<boolean>('atPrefix', true);
  const rawSeparator = cfg.get<string>('rangeSeparator', 'dash');
  const rangeSeparator: RangeSeparator = rawSeparator === 'colon' ? 'colon' : 'dash';
  const exitVisualModeAfterCopy = cfg.get<boolean>('exitVisualModeAfterCopy', true);
  return { atPrefix, rangeSeparator, exitVisualModeAfterCopy };
}
