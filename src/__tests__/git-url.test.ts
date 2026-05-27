import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { normalizeRemoteUrl, buildGitHubUrl } from '../git-url';

test('normalizeRemoteUrl: SCP-style SSH', () => {
  assert.deepEqual(normalizeRemoteUrl('git@github.com:user/repo.git'), {
    host: 'github.com',
    httpsBase: 'https://github.com/user/repo',
  });
});

test('normalizeRemoteUrl: SCP-style SSH without .git', () => {
  assert.deepEqual(normalizeRemoteUrl('git@github.com:user/repo'), {
    host: 'github.com',
    httpsBase: 'https://github.com/user/repo',
  });
});

test('normalizeRemoteUrl: HTTPS with .git', () => {
  assert.deepEqual(normalizeRemoteUrl('https://github.com/user/repo.git'), {
    host: 'github.com',
    httpsBase: 'https://github.com/user/repo',
  });
});

test('normalizeRemoteUrl: HTTPS without .git', () => {
  assert.deepEqual(normalizeRemoteUrl('https://github.com/user/repo'), {
    host: 'github.com',
    httpsBase: 'https://github.com/user/repo',
  });
});

test('normalizeRemoteUrl: ssh:// URL with port', () => {
  assert.deepEqual(normalizeRemoteUrl('ssh://git@github.com:22/user/repo.git'), {
    host: 'github.com',
    httpsBase: 'https://github.com/user/repo',
  });
});

test('normalizeRemoteUrl: ssh:// URL without port', () => {
  assert.deepEqual(normalizeRemoteUrl('ssh://git@github.com/user/repo.git'), {
    host: 'github.com',
    httpsBase: 'https://github.com/user/repo',
  });
});

test('normalizeRemoteUrl: gitlab host preserved', () => {
  assert.deepEqual(normalizeRemoteUrl('git@gitlab.com:group/sub/repo.git'), {
    host: 'gitlab.com',
    httpsBase: 'https://gitlab.com/group/sub/repo',
  });
});

test('normalizeRemoteUrl: malformed input returns null', () => {
  assert.equal(normalizeRemoteUrl('not-a-url'), null);
  assert.equal(normalizeRemoteUrl(''), null);
});

test('buildGitHubUrl: single line', () => {
  const url = buildGitHubUrl({
    httpsBase: 'https://github.com/user/repo',
    ref: 'abc1234',
    pathFromRoot: 'src/file.ts',
    startLine: 10,
    endLine: 10,
  });
  assert.equal(url, 'https://github.com/user/repo/blob/abc1234/src/file.ts#L10');
});

test('buildGitHubUrl: line range', () => {
  const url = buildGitHubUrl({
    httpsBase: 'https://github.com/user/repo',
    ref: 'abc1234',
    pathFromRoot: 'src/file.ts',
    startLine: 10,
    endLine: 25,
  });
  assert.equal(url, 'https://github.com/user/repo/blob/abc1234/src/file.ts#L10-L25');
});

test('buildGitHubUrl: branch ref with slash', () => {
  const url = buildGitHubUrl({
    httpsBase: 'https://github.com/user/repo',
    ref: 'feature/x',
    pathFromRoot: 'a/b.ts',
    startLine: 1,
    endLine: 1,
  });
  assert.equal(url, 'https://github.com/user/repo/blob/feature/x/a/b.ts#L1');
});

test('buildGitHubUrl: path with spaces gets percent-encoded', () => {
  const url = buildGitHubUrl({
    httpsBase: 'https://github.com/user/repo',
    ref: 'main',
    pathFromRoot: 'has space/file.ts',
    startLine: 1,
    endLine: 1,
  });
  assert.equal(url, 'https://github.com/user/repo/blob/main/has%20space/file.ts#L1');
});
