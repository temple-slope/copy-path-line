local M = {}

local defaults = {
  at_prefix = true,
  range_separator = 'dash', -- 'dash' | 'colon'
  git_ref = 'commit',        -- 'commit' | 'branch'
  git_remote = 'origin',
  keymaps = {
    line = '<C-S-A-l>',
    markdown = '<C-S-A-m>',
    relative = '<C-S-A-c>',
    full = '<C-S-A-f>',
    git_url = '<C-S-A-g>',
  },
}

local valid_range_sep = { dash = true, colon = true }
local valid_git_ref = { commit = true, branch = true }

local function merge_keymaps(user)
  if user == false then
    return false
  end
  local out = {}
  for k, v in pairs(defaults.keymaps) do
    out[k] = v
  end
  if type(user) == 'table' then
    for k, v in pairs(user) do
      out[k] = v -- may be string or false
    end
  end
  return out
end

function M.resolve(user)
  user = user or {}
  local out = {}

  -- at_prefix: user value if provided (even if false), else default
  if user.at_prefix ~= nil then
    out.at_prefix = user.at_prefix
  else
    out.at_prefix = defaults.at_prefix
  end

  -- range_separator: validate and use, else default
  out.range_separator = valid_range_sep[user.range_separator]
      and user.range_separator
    or defaults.range_separator

  -- git_ref: validate and use, else default
  out.git_ref = valid_git_ref[user.git_ref] and user.git_ref or defaults.git_ref

  -- git_remote: user value if provided, else default
  out.git_remote = user.git_remote or defaults.git_remote

  -- keymaps: merge
  out.keymaps = merge_keymaps(user.keymaps)

  return out
end

M.defaults = defaults

return M
