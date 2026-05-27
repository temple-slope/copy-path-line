local config = require('copy-path-line.config')
local commands = require('copy-path-line.commands')

local M = {}

M._cfg = config.resolve(nil)

local function set_keymap(lhs, fn)
  if lhs == false or lhs == nil then
    return
  end
  vim.keymap.set({ 'n', 'v' }, lhs, fn, { silent = true, desc = 'copy-path-line' })
end

local function apply_keymaps(cfg)
  if cfg.keymaps == false then
    return
  end
  set_keymap(cfg.keymaps.line, function() commands.copy_path_line(M._cfg) end)
  set_keymap(cfg.keymaps.markdown, function() commands.copy_markdown(M._cfg) end)
  set_keymap(cfg.keymaps.relative, function() commands.copy_relative(M._cfg) end)
  set_keymap(cfg.keymaps.full, function() commands.copy_full(M._cfg) end)
  set_keymap(cfg.keymaps.git_url, function() commands.copy_git_url(M._cfg) end)
end

function M.setup(user_opts)
  M._cfg = config.resolve(user_opts)
  apply_keymaps(M._cfg)
end

-- Direct accessors for the Ex commands in plugin/copy-path-line.lua
function M._call(name)
  return commands[name](M._cfg)
end

return M
