local M = {}

local function prefix(cfg)
  return cfg.at_prefix and '@' or ''
end

local function range_sep(cfg)
  return cfg.range_separator == 'colon' and ':' or '-'
end

local function line_suffix(range, cfg)
  if range.start_line == range.end_line then
    return ':' .. range.start_line
  end
  return ':' .. range.start_line .. range_sep(cfg) .. range.end_line
end

function M.format_path_line(rel_path, range, cfg)
  return prefix(cfg) .. rel_path .. line_suffix(range, cfg)
end

function M.format_path(rel_path, cfg)
  return prefix(cfg) .. rel_path
end

function M.format_full_path(abs_path, cfg)
  return prefix(cfg) .. abs_path
end

local function fence_for(text)
  local max_run = 0
  local current = 0
  for i = 1, #text do
    if text:sub(i, i) == '`' then
      current = current + 1
      if current > max_run then
        max_run = current
      end
    else
      current = 0
    end
  end
  local n = math.max(3, max_run + 1)
  return string.rep('`', n)
end

function M.format_markdown(rel_path, range, lines, language, cfg)
  local label = M.format_path_line(rel_path, range, cfg)
  local code = table.concat(lines, '\n')
  local fence = fence_for(code)
  return label .. '\n' .. fence .. (language or '') .. '\n' .. code .. '\n' .. fence
end

return M
