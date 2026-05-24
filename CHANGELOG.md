# Changelog

## [0.1.0] - 2026-05-24

### Added
- Three new commands designed for the Claude Code workflow:
  - `Copy Path with Line as Markdown` (`Shift+Alt+Cmd+M`) — copies the file path label plus the selected code as a Markdown fenced block, ready to paste into a Claude Code prompt.
  - `Copy Relative Path` (`Shift+Alt+Cmd+C`) — copies `@src/file.ts` (or plain `src/file.ts` if `atPrefix` is off).
  - `Copy Full Path` (`Shift+Alt+Cmd+F`) — copies an absolute path with the optional `@` prefix.
- Settings:
  - `copy-path-line.atPrefix` (boolean, default `true`) — toggle the `@` prefix.
  - `copy-path-line.rangeSeparator` (`"dash"` | `"colon"`, default `"dash"`) — switch between `15-19` and `15:19`.
  - `copy-path-line.exitVisualModeAfterCopy` (boolean, default `true`) — after copying, exit Vim visual mode via `extension.vim_escape` (no effect without VSCodeVim).

### Changed
- **BREAKING:** The default `Shift+Alt+Cmd+L` output is now `@src/file.ts:10-25` (was `src/file.ts:10:25`).
  - To restore the previous behavior, set `copy-path-line.atPrefix: false` and `copy-path-line.rangeSeparator: "colon"`.
- The command formerly titled "Copy Relative Path with Line Number" is now "Copy Path with Line" in the Command Palette. The command ID (`copy-path-line.copy`) is unchanged, so existing keybindings continue to work.
- Internal: split `src/extension.ts` into `config.ts`, `formatters.ts`, `commands.ts`, and `extension.ts` for clarity.

## [0.0.1] - 2025-01-10

### Added
- Initial release
- Copy relative path with line number
- Copy relative path with line range for selections
- Keyboard shortcut: Shift+Alt+Cmd+L
