package.path = './nvim/lua/?.lua;./nvim/lua/?/init.lua;' .. package.path
local m = require('copy-path-line')
m.setup({ keymaps = false })
assert(m._cfg.at_prefix == true, 'default applied')
print('init_smoke_spec: OK')
