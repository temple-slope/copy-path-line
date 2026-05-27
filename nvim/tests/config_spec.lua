-- Run with: nvim --headless --noplugin -u NONE -l nvim/tests/config_spec.lua
package.path = './nvim/lua/?.lua;./nvim/lua/?/init.lua;' .. package.path

local config = require('copy-path-line.config')

-- 1. Defaults
local d = config.resolve(nil)
assert(d.at_prefix == true, 'at_prefix default')
assert(d.range_separator == 'dash', 'range_separator default')
assert(d.git_ref == 'commit', 'git_ref default')
assert(d.git_remote == 'origin', 'git_remote default')
assert(d.keymaps.line == '<C-S-A-l>', 'line keymap default')
assert(d.keymaps.git_url == '<C-S-A-g>', 'git_url keymap default')

-- 2. User override
local u = config.resolve({
  at_prefix = false,
  range_separator = 'colon',
  git_ref = 'branch',
  keymaps = { line = '<leader>cl', git_url = false },
})
assert(u.at_prefix == false, 'at_prefix override')
assert(u.range_separator == 'colon', 'range_separator override')
assert(u.git_ref == 'branch', 'git_ref override')
assert(u.git_remote == 'origin', 'git_remote default preserved')
assert(u.keymaps.line == '<leader>cl', 'line keymap override')
assert(u.keymaps.git_url == false, 'git_url keymap disabled')
assert(u.keymaps.markdown == '<C-S-A-m>', 'markdown keymap default preserved')

-- 3. keymaps = false → all disabled
local k = config.resolve({ keymaps = false })
assert(k.keymaps == false, 'keymaps fully disabled')

-- 4. Invalid enum falls back to default
local i = config.resolve({ range_separator = 'pipe', git_ref = 'tag' })
assert(i.range_separator == 'dash', 'invalid range_separator → dash')
assert(i.git_ref == 'commit', 'invalid git_ref → commit')

print('config_spec: OK')
