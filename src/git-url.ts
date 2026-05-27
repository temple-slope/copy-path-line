export type NormalizedRemote = {
  host: string;
  httpsBase: string;
};

const SCP_RE = /^([^@\s]+)@([^:\s]+):(.+?)(?:\.git)?$/;
const SSH_RE = /^ssh:\/\/(?:[^@\s]+@)?([^:/\s]+)(?::\d+)?\/(.+?)(?:\.git)?$/;
const HTTPS_RE = /^https?:\/\/(?:[^@\s]+@)?([^/\s]+)\/(.+?)(?:\.git)?$/;

export function normalizeRemoteUrl(raw: string): NormalizedRemote | null {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();

  let host: string | undefined;
  let path: string | undefined;

  // Order matters: SCP_RE is loose ("user@host:path") and would match
  // ssh://git@github.com:22/... as host=github.com path=22/.... Try the
  // protocol-prefixed forms first.
  const ssh = SSH_RE.exec(trimmed);
  if (ssh) {
    host = ssh[1];
    path = ssh[2];
  } else {
    const https = HTTPS_RE.exec(trimmed);
    if (https) {
      host = https[1];
      path = https[2];
    } else {
      const scp = SCP_RE.exec(trimmed);
      if (scp) {
        host = scp[2];
        path = scp[3];
      }
    }
  }

  if (!host || !path) {
    return null;
  }
  // Strip a trailing .git if the regex didn't already (defensive).
  const cleanPath = path.replace(/\.git$/, '');
  return {
    host,
    httpsBase: `https://${host}/${cleanPath}`,
  };
}

export interface BuildGitHubUrlArgs {
  httpsBase: string;
  ref: string;
  pathFromRoot: string;
  startLine: number;
  endLine: number;
}

export function buildGitHubUrl(args: BuildGitHubUrlArgs): string {
  const encodedPath = args.pathFromRoot
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  const fragment =
    args.startLine === args.endLine
      ? `#L${args.startLine}`
      : `#L${args.startLine}-L${args.endLine}`;
  return `${args.httpsBase}/blob/${args.ref}/${encodedPath}${fragment}`;
}
