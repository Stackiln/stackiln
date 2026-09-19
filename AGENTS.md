# Site Factory

Use `pnpm.cmd` on Windows PowerShell when the execution policy blocks `pnpm.ps1`.

The factory owns templates and recipes. Generated product files belong to the product. Do not overwrite a changed managed file without a conflict report. Plans must be read only; apply changes through staging. Keep modules absent when disabled.

Run `pnpm verify` after generator changes and verify at least one generated product after template changes. Record completed gates in `docs/build-progress.md`.
