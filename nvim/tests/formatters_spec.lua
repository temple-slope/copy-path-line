package.path = './nvim/lua/?.lua;./nvim/lua/?/init.lua;' .. package.path

local fmt = require('copy-path-line.formatters')

local cfg = {
  at_prefix = true,
  range_separator = 'dash',
  git_ref = 'commit',
  git_remote = 'origin',
}

local function eq(a, b, msg)
  assert(a == b, (msg or '') .. ' — got: ' .. tostring(a))
end

-- format_path_line
eq(fmt.format_path_line('src/a.ts', { start_line = 10, end_line = 10 }, cfg),
   '@src/a.ts:10', 'single line dash')
eq(fmt.format_path_line('src/a.ts', { start_line = 10, end_line = 25 }, cfg),
   '@src/a.ts:10-25', 'range dash')

local cfg_colon = vim.tbl_extend('force', cfg, { range_separator = 'colon' })
eq(fmt.format_path_line('src/a.ts', { start_line = 10, end_line = 25 }, cfg_colon),
   '@src/a.ts:10:25', 'range colon')

local cfg_no_at = vim.tbl_extend('force', cfg, { at_prefix = false })
eq(fmt.format_path_line('src/a.ts', { start_line = 10, end_line = 10 }, cfg_no_at),
   'src/a.ts:10', 'no @ prefix')

-- format_path
eq(fmt.format_path('src/a.ts', cfg), '@src/a.ts', 'relative with @')
eq(fmt.format_path('src/a.ts', cfg_no_at), 'src/a.ts', 'relative no @')

-- format_full_path
eq(fmt.format_full_path('/tmp/x.ts', cfg), '@/tmp/x.ts', 'full with @')

-- format_markdown
local md = fmt.format_markdown(
  'src/a.ts',
  { start_line = 1, end_line = 2 },
  { 'line one', 'line two' },
  'typescript',
  cfg
)
eq(md, '@src/a.ts:1-2\n```typescript\nline one\nline two\n```', 'markdown')

-- fence escalation when code contains backticks
local md2 = fmt.format_markdown(
  'src/a.ts',
  { start_line = 1, end_line = 1 },
  { '```inner```' },
  'typescript',
  cfg
)
eq(md2, '@src/a.ts:1\n````typescript\n```inner```\n````', 'fence escalation')

print('formatters_spec: OK')
