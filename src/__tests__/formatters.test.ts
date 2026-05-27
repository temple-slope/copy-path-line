import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { formatGitUrl } from '../formatters';
import type { GitInfo } from '../git';

const gitInfo: GitInfo = {
  repoRoot: '/tmp/repo',
  remoteUrl: 'https://github.com/user/repo',
  host: 'github.com',
  ref: 'abc1234',
  pathFromRoot: 'src/file.ts',
};

test('formatGitUrl: single line', () => {
  assert.equal(
    formatGitUrl(gitInfo, { startLine: 10, endLine: 10 }),
    'https://github.com/user/repo/blob/abc1234/src/file.ts#L10',
  );
});

test('formatGitUrl: range', () => {
  assert.equal(
    formatGitUrl(gitInfo, { startLine: 10, endLine: 25 }),
    'https://github.com/user/repo/blob/abc1234/src/file.ts#L10-L25',
  );
});
