if vim.g.loaded_copy_path_line then
  return
end
vim.g.loaded_copy_path_line = 1

local function call(name)
  return function()
    require('copy-path-line')._call(name)
  end
end

vim.api.nvim_create_user_command('CopyPathLine', call('copy_path_line'), { range = true })
vim.api.nvim_create_user_command('CopyPathLineMarkdown', call('copy_markdown'), { range = true })
vim.api.nvim_create_user_command('CopyRelativePath', call('copy_relative'), {})
vim.api.nvim_create_user_command('CopyFullPath', call('copy_full'), {})
vim.api.nvim_create_user_command('CopyGitUrl', call('copy_git_url'), { range = true })
