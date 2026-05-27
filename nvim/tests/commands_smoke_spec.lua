package.path = './nvim/lua/?.lua;./nvim/lua/?/init.lua;' .. package.path
local c = require('copy-path-line.commands')
for _, name in ipairs({ 'copy_path_line', 'copy_markdown', 'copy_relative', 'copy_full', 'copy_git_url' }) do
  assert(type(c[name]) == 'function', name .. ' exists')
end
print('commands_smoke_spec: OK')
