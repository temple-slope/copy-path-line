package.path = './nvim/lua/?.lua;./nvim/lua/?/init.lua;' .. package.path
local g = require('copy-path-line.git')
assert(type(g.get_info) == 'function', 'get_info exists')
print('git_smoke_spec: OK')
