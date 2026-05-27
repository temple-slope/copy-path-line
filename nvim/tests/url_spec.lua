package.path = './nvim/lua/?.lua;./nvim/lua/?/init.lua;' .. package.path

local url = require('copy-path-line.url')

local function eq(a, b, msg)
  assert(a == b, (msg or '') .. ' — got: ' .. tostring(a))
end

-- normalize_remote_url
local scp = url.normalize_remote_url('git@github.com:user/repo.git')
eq(scp.host, 'github.com', 'scp host')
eq(scp.https_base, 'https://github.com/user/repo', 'scp base')

local scp2 = url.normalize_remote_url('git@github.com:user/repo')
eq(scp2.https_base, 'https://github.com/user/repo', 'scp no .git')

local https = url.normalize_remote_url('https://github.com/user/repo.git')
eq(https.https_base, 'https://github.com/user/repo', 'https with .git')

local ssh = url.normalize_remote_url('ssh://git@github.com:22/user/repo.git')
eq(ssh.https_base, 'https://github.com/user/repo', 'ssh:// with port')

local bad = url.normalize_remote_url('not-a-url')
assert(bad == nil, 'malformed returns nil')

-- build_github_url
eq(
  url.build_github_url({
    https_base = 'https://github.com/user/repo',
    ref = 'abc1234',
    path_from_root = 'src/file.ts',
    start_line = 10,
    end_line = 10,
  }),
  'https://github.com/user/repo/blob/abc1234/src/file.ts#L10',
  'single line'
)
eq(
  url.build_github_url({
    https_base = 'https://github.com/user/repo',
    ref = 'abc1234',
    path_from_root = 'src/file.ts',
    start_line = 10,
    end_line = 25,
  }),
  'https://github.com/user/repo/blob/abc1234/src/file.ts#L10-L25',
  'range'
)
eq(
  url.build_github_url({
    https_base = 'https://github.com/user/repo',
    ref = 'main',
    path_from_root = 'has space/file.ts',
    start_line = 1,
    end_line = 1,
  }),
  'https://github.com/user/repo/blob/main/has%20space/file.ts#L1',
  'percent-encoded path'
)

print('url_spec: OK')
