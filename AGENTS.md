# Stackiln

Use `pnpm.cmd` on Windows PowerShell when the execution policy blocks `pnpm.ps1`.

Stackiln owns templates and recipes. Generated product files belong to the product. Do not overwrite a changed managed file without a conflict report. Plans must be read only; apply changes through staging. Keep modules absent when disabled.

Run `pnpm verify` after generator or template changes; it checks Stackiln, the marketing fixture, PostgreSQL migration, browser journeys, and container. Docker must be running. Record completed gates in `docs/build-progress.md`.
