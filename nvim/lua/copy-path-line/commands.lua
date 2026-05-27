local fmt = require('copy-path-line.formatters')
local git = require('copy-path-line.git')

local M = {}

local function notify_info(msg)
  vim.notify(msg, vim.log.levels.INFO, { title = 'copy-path-line' })
end

local function notify_warn(msg)
  vim.notify(msg, vim.log.levels.WARN, { title = 'copy-path-line' })
end

local TOAST_MAX = 80

local function preview(s)
  local one = s:gsub('\n', ' ')
  if #one <= TOAST_MAX then
    return one
  end
  return one:sub(1, TOAST_MAX - 1) .. '…'
end

local function copy(value)
  vim.fn.setreg('+', value)
  vim.fn.setreg('"', value)
  notify_info('Copied: ' .. preview(value))
end

-- Returns { start_line, end_line, lines } based on current mode.
local function get_range_and_lines()
  local mode = vim.fn.mode()
  local buf = vim.api.nvim_get_current_buf()
  if mode == 'v' or mode == 'V' or mode == '\22' then
    -- Visual; use the live cursor and the other end of the selection.
    local start_line = vim.fn.line('v')
    local end_line = vim.fn.line('.')
    if start_line > end_line then
      start_line, end_line = end_line, start_line
    end
    local lines = vim.api.nvim_buf_get_lines(buf, start_line - 1, end_line, false)
    -- Leave visual mode so subsequent operations behave normally.
    vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes('<Esc>', true, false, true), 'nx', false)
    return start_line, end_line, lines
  end
  -- Normal: use marks '<' '>' if they exist and are on the current buffer,
  -- otherwise use the current cursor line.
  local line = vim.fn.line('.')
  local lines = vim.api.nvim_buf_get_lines(buf, line - 1, line, false)
  return line, line, lines
end

local function require_file_path()
  local p = vim.api.nvim_buf_get_name(0)
  if p == nil or p == '' then
    notify_warn('No file for current buffer')
    return nil
  end
  return p
end

local function cwd_relative(abs)
  local cwd = vim.fn.getcwd()
  if abs:sub(1, #cwd + 1) == cwd .. '/' then
    return abs:sub(#cwd + 2)
  end
  return abs
end

local function repo_or_cwd_relative(abs)
  -- Prefer git repo root if available; fall back to cwd-relative.
  local root = vim.fn.systemlist({ 'git', '-C', vim.fn.fnamemodify(abs, ':h'), 'rev-parse', '--show-toplevel' })
  if vim.v.shell_error == 0 and root[1] and root[1] ~= '' then
    if abs:sub(1, #root[1] + 1) == root[1] .. '/' then
      return abs:sub(#root[1] + 2)
    end
  end
  return cwd_relative(abs)
end

function M.copy_path_line(cfg)
  local p = require_file_path()
  if not p then return end
  local s, e = get_range_and_lines()
  copy(fmt.format_path_line(repo_or_cwd_relative(p), { start_line = s, end_line = e }, cfg))
end

function M.copy_markdown(cfg)
  local p = require_file_path()
  if not p then return end
  local s, e, lines = get_range_and_lines()
  local lang = vim.bo.filetype or ''
  copy(fmt.format_markdown(repo_or_cwd_relative(p), { start_line = s, end_line = e }, lines, lang, cfg))
end

function M.copy_relative(cfg)
  local p = require_file_path()
  if not p then return end
  copy(fmt.format_path(repo_or_cwd_relative(p), cfg))
end

function M.copy_full(cfg)
  local p = require_file_path()
  if not p then return end
  copy(fmt.format_full_path(vim.fn.fnamemodify(p, ':p'), cfg))
end

function M.copy_git_url(cfg)
  local p = require_file_path()
  if not p then return end
  local info, err = git.get_info(p, cfg)
  if not info then
    notify_warn('Copy Git URL: ' .. err)
    return
  end
  local s, e = get_range_and_lines()
  local url_mod = require('copy-path-line.url')
  local out = url_mod.build_github_url({
    https_base = info.remote_url,
    ref = info.ref,
    path_from_root = info.path_from_root,
    start_line = s,
    end_line = e,
  })
  copy(out)
end

return M
