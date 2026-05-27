local M = {}

-- SCP-like: user@host:path
local function parse_scp(s)
  local host, path = s:match('^[^@%s]+@([^:%s]+):(.+)$')
  return host, path
end

-- ssh://[user@]host[:port]/path
local function parse_ssh(s)
  local rest = s:match('^ssh://(.+)$')
  if not rest then
    return nil, nil
  end
  -- strip optional user@
  rest = rest:gsub('^[^@/%s]+@', '')
  local host_port, path = rest:match('^([^/]+)/(.+)$')
  if not host_port then
    return nil, nil
  end
  local host = host_port:match('^([^:]+)') or host_port
  return host, path
end

-- https://[user@]host/path
local function parse_https(s)
  local rest = s:match('^https?://(.+)$')
  if not rest then
    return nil, nil
  end
  rest = rest:gsub('^[^@/%s]+@', '')
  local host, path = rest:match('^([^/]+)/(.+)$')
  return host, path
end

function M.normalize_remote_url(raw)
  if type(raw) ~= 'string' or raw == '' then
    return nil
  end
  local s = raw:gsub('^%s+', ''):gsub('%s+$', '')

  -- Order matters: parse_scp is loose ("user@host:path") and would match
  -- ssh://git@github.com:22/... incorrectly. Try protocol-prefixed forms first.
  local host, path = parse_ssh(s)
  if not host then
    host, path = parse_https(s)
  end
  if not host then
    host, path = parse_scp(s)
  end
  if not host or not path then
    return nil
  end
  path = path:gsub('%.git$', '')
  return {
    host = host,
    https_base = 'https://' .. host .. '/' .. path,
  }
end

local function encode_segment(seg)
  return (seg:gsub('[^A-Za-z0-9._~%-]', function(c)
    return string.format('%%%02X', string.byte(c))
  end))
end

function M.build_github_url(args)
  local segments = {}
  for seg in (args.path_from_root .. '/'):gmatch('([^/]*)/') do
    segments[#segments + 1] = encode_segment(seg)
  end
  local encoded_path = table.concat(segments, '/')
  local fragment
  if args.start_line == args.end_line then
    fragment = '#L' .. args.start_line
  else
    fragment = '#L' .. args.start_line .. '-L' .. args.end_line
  end
  return args.https_base
    .. '/blob/'
    .. args.ref
    .. '/'
    .. encoded_path
    .. fragment
end

return M
