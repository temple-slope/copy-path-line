# Copy Path with Line

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/temple-slope.copy-path-line)](https://marketplace.visualstudio.com/items?itemName=temple-slope.copy-path-line)
[![Open VSX](https://img.shields.io/open-vsx/v/temple-slope/copy-path-line)](https://open-vsx.org/extension/temple-slope/copy-path-line)

Copy file paths and code snippets in **Claude Code-friendly formats**. Designed so you can paste straight into a Claude Code prompt without editing.

![Demo](https://raw.githubusercontent.com/temple-slope/copy-path-line/main/demo.gif)

## Install

- [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=temple-slope.copy-path-line)
- [Open VSX](https://open-vsx.org/extension/temple-slope/copy-path-line)

## Features

Four commands, all defaulting to a `@`-prefixed format that Claude Code resolves as a file reference.

| Command | Default output | Default keybinding (Mac) |
| --- | --- | --- |
| Copy Path with Line | `@src/file.ts:10-25` | `Shift+Alt+Cmd+L` |
| Copy Path with Line as Markdown | path label + fenced code block | `Shift+Alt+Cmd+M` |
| Copy Relative Path | `@src/file.ts` | `Shift+Alt+Cmd+C` |
| Copy Full Path | `@/Users/.../src/file.ts` | `Shift+Alt+Cmd+F` |

### Markdown output example

Pressing `Shift+Alt+Cmd+M` with lines 15–19 selected produces:

````
@src/extension.ts:15-19
```typescript
if (selection.start.line === selection.end.line) {
  result = `${relativePath}:${selection.start.line + 1}`;
} else {
  ...
}
```
````

Paste it into Claude Code and the model gets both the file reference and the exact snippet you're talking about.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `copy-path-line.atPrefix` | `true` | Prepend `@` to copied paths. Set `false` for plain paths. |
| `copy-path-line.rangeSeparator` | `"dash"` | Range separator. `"dash"` → `15-19`, `"colon"` → `15:19`. |
| `copy-path-line.exitVisualModeAfterCopy` | `true` | After copying, exit Vim visual mode (calls `extension.vim_escape`). No effect without VSCodeVim. |

To restore the pre-0.1.0 behavior (`src/file.ts:10:25`):

```json
"copy-path-line.atPrefix": false,
"copy-path-line.rangeSeparator": "colon"
```

## Keybindings

| Command | Mac shortcut |
| --- | --- |
| `copy-path-line.copy` | `Shift+Alt+Cmd+L` |
| `copy-path-line.copyAsMarkdown` | `Shift+Alt+Cmd+M` |
| `copy-path-line.copyRelativePath` | `Shift+Alt+Cmd+C` |
| `copy-path-line.copyFullPath` | `Shift+Alt+Cmd+F` |

All keybindings can be customized in VSCode's `keybindings.json`. `Shift+Alt+Cmd+F` is the built-in Format Document shortcut and may need rebinding if you want the full-path command on that key.

## License

MIT
