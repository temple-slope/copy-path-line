# Changelog

## [0.2.0] - 2026-05-27

### Added
- `Copy GitHub URL` command (`Shift+Alt+Cmd+G`) that produces a GitHub permalink with the line range, e.g. `https://github.com/<owner>/<repo>/blob/<sha>/<path>#L10-L25`.
- Settings:
  - `copy-path-line.gitRef` (`"commit"` | `"branch"`, default `"commit"`) — embed the current HEAD SHA (permalink) or the current branch name (mutable).
  - `copy-path-line.gitRemote` (string, default `"origin"`) — which git remote to read the URL from.
- New Neovim plugin under `nvim/` with feature parity: `:CopyPathLine`, `:CopyPathLineMarkdown`, `:CopyRelativePath`, `:CopyFullPath`, `:CopyGitUrl`. Default keymaps: `<C-S-A-l/m/c/f/g>`.

### Notes
- The GitHub URL line fragment always uses `#L<start>-L<end>` regardless of `rangeSeparator` (GitHub's convention).
- Non-GitHub remotes currently produce a warning. GitLab/Bitbucket support is a follow-up.

## [0.1.1] - 2026-05-24

### Fixed
- Align `engines.vscode` with `@types/vscode` (^1.116.0) so `vsce package` no longer rejects the build. This unblocks the v0.1.0 release that failed at the publish step.

### Changed
- Minimum supported VSCode version is now 1.116 (was 1.85). The extension itself does not require new API surface; this aligns the engine requirement with the type definitions already in use.

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
