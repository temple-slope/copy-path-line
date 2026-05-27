local url_mod = require('copy-path-line.url')

local M = {}

local function run(cmd, cwd)
  local ok, sysmod = pcall(function() return vim.system end)
  if ok and sysmod and type(sysmod) == 'function' then
    local res = vim.system(cmd, { cwd = cwd, text = true }):wait()
    if res.code ~= 0 then
      return nil, (res.stderr or ''):gsub('%s+$', '')
    end
    return (res.stdout or ''):gsub('%s+$', ''), nil
  end
  -- Fallback for Neovim < 0.10
  local out = vim.fn.systemlist(table.concat(cmd, ' ') .. ' 2>/dev/null')
  if vim.v.shell_error ~= 0 then
    return nil, 'git command failed'
  end
  return table.concat(out, '\n'):gsub('%s+$', ''), nil
end

function M.get_info(file_path, cfg)
  local file_dir = vim.fn.fnamemodify(file_path, ':h')

  local root, err = run({ 'git', '-C', file_dir, 'rev-parse', '--show-toplevel' })
  if not root or root == '' then
    return nil, 'Not in a git repository'
  end

  local remote = run({ 'git', '-C', root, 'config', '--get', 'remote.' .. cfg.git_remote .. '.url' })
  if not remote or remote == '' then
    return nil, "Remote '" .. cfg.git_remote .. "' not found"
  end

  local normalized = url_mod.normalize_remote_url(remote)
  if not normalized then
    return nil, 'Could not parse remote URL: ' .. remote
  end
  if normalized.host ~= 'github.com' then
    return nil, 'Unsupported git host: ' .. normalized.host
  end

  local ref
  if cfg.git_ref == 'branch' then
    local branch = run({ 'git', '-C', root, 'symbolic-ref', '--short', 'HEAD' })
    if branch and branch ~= '' then
      ref = branch
    else
      local short_sha = run({ 'git', '-C', root, 'rev-parse', '--short', 'HEAD' })
      if not short_sha or short_sha == '' then
        return nil, 'No commits in repository'
      end
      ref = short_sha
    end
  else
    local sha = run({ 'git', '-C', root, 'rev-parse', 'HEAD' })
    if not sha or sha == '' then
      return nil, 'No commits in repository'
    end
    ref = sha
  end

  -- POSIX-style relative path
  local rel = vim.fn.fnamemodify(file_path, ':p')
  rel = rel:sub(#root + 2) -- strip "<root>/"

  return {
    repo_root = root,
    remote_url = normalized.https_base,
    host = normalized.host,
    ref = ref,
    path_from_root = rel,
  }, nil
end

return M
