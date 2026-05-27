# copy-path-line (Neovim)

Neovim plugin sibling of the [VSCode extension](../README.md). Exposes the same five commands.

## Install (lazy.nvim)

```lua
{
  -- Once published, swap this for the github URL.
  dir = vim.fn.expand('~/Documents/Development/copy-path-line/nvim'),
  name = 'copy-path-line',
  event = 'VeryLazy',
  opts = {},
}
```

## Defaults

| Lua option | Default |
| --- | --- |
| `at_prefix` | `true` |
| `range_separator` | `'dash'` (`'dash'` \| `'colon'`) |
| `git_ref` | `'commit'` (`'commit'` \| `'branch'`) |
| `git_remote` | `'origin'` |
| `keymaps.line` | `<C-S-A-l>` |
| `keymaps.markdown` | `<C-S-A-m>` |
| `keymaps.relative` | `<C-S-A-c>` |
| `keymaps.full` | `<C-S-A-f>` |
| `keymaps.git_url` | `<C-S-A-g>` |

Pass `keymaps = false` to skip all default bindings; per-key `false` disables just that one.

## Ex commands

`:CopyPathLine`, `:CopyPathLineMarkdown`, `:CopyRelativePath`, `:CopyFullPath`, `:CopyGitUrl`.

## Running tests

```bash
for spec in nvim/tests/*_spec.lua; do
  nvim --headless --noplugin -u NONE -l "$spec" || exit 1
done
```

Each prints `<spec>: OK` and exits 0 on success.
