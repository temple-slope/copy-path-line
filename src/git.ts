import { promisify } from 'util';
import { execFile } from 'child_process';
import * as path from 'path';
import type { FormatConfig } from './config';
import { normalizeRemoteUrl } from './git-url';

const execFileAsync = promisify(execFile);

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export interface GitInfo {
  repoRoot: string;
  remoteUrl: string; // normalized HTTPS, no .git suffix
  host: string;
  ref: string;
  pathFromRoot: string;
}

async function git(args: string[], cwd: string): Promise<Result<string>> {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd });
    return { ok: true, value: stdout.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

export async function getGitInfo(
  filePath: string,
  cfg: FormatConfig,
): Promise<Result<GitInfo>> {
  const fileDir = path.dirname(filePath);

  const root = await git(['rev-parse', '--show-toplevel'], fileDir);
  if (!root.ok) {
    return { ok: false, error: 'Not in a git repository' };
  }
  const repoRoot = root.value;

  const remote = await git(
    ['config', '--get', `remote.${cfg.gitRemote}.url`],
    repoRoot,
  );
  if (!remote.ok || !remote.value) {
    return { ok: false, error: `Remote '${cfg.gitRemote}' not found` };
  }
  const normalized = normalizeRemoteUrl(remote.value);
  if (!normalized) {
    return { ok: false, error: `Could not parse remote URL: ${remote.value}` };
  }
  if (normalized.host !== 'github.com') {
    return { ok: false, error: `Unsupported git host: ${normalized.host}` };
  }

  let ref: string;
  if (cfg.gitRef === 'branch') {
    const branch = await git(['symbolic-ref', '--short', 'HEAD'], repoRoot);
    if (branch.ok) {
      ref = branch.value;
    } else {
      // Detached HEAD: fall back to short SHA
      const shortSha = await git(['rev-parse', '--short', 'HEAD'], repoRoot);
      if (!shortSha.ok) {
        return { ok: false, error: 'No commits in repository' };
      }
      ref = shortSha.value;
    }
  } else {
    const sha = await git(['rev-parse', 'HEAD'], repoRoot);
    if (!sha.ok) {
      return { ok: false, error: 'No commits in repository' };
    }
    ref = sha.value;
  }

  // pathFromRoot uses POSIX separators (URL form), even on Windows.
  const pathFromRoot = path
    .relative(repoRoot, filePath)
    .split(path.sep)
    .join('/');

  return {
    ok: true,
    value: {
      repoRoot,
      remoteUrl: normalized.httpsBase,
      host: normalized.host,
      ref,
      pathFromRoot,
    },
  };
}
