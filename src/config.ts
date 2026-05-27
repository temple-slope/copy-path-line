import * as vscode from 'vscode';

export type RangeSeparator = 'dash' | 'colon';
export type GitRef = 'commit' | 'branch';

export interface FormatConfig {
  atPrefix: boolean;
  rangeSeparator: RangeSeparator;
  exitVisualModeAfterCopy: boolean;
  gitRef: GitRef;
  gitRemote: string;
}

export function readConfig(): FormatConfig {
  const cfg = vscode.workspace.getConfiguration('copy-path-line');
  const atPrefix = cfg.get<boolean>('atPrefix', true);
  const rawSeparator = cfg.get<string>('rangeSeparator', 'dash');
  const rangeSeparator: RangeSeparator = rawSeparator === 'colon' ? 'colon' : 'dash';
  const exitVisualModeAfterCopy = cfg.get<boolean>('exitVisualModeAfterCopy', true);
  const rawGitRef = cfg.get<string>('gitRef', 'commit');
  const gitRef: GitRef = rawGitRef === 'branch' ? 'branch' : 'commit';
  const gitRemote = cfg.get<string>('gitRemote', 'origin') || 'origin';
  return { atPrefix, rangeSeparator, exitVisualModeAfterCopy, gitRef, gitRemote };
}
