# Contributing to Stackiln

Thank you for helping improve Stackiln. Contributions of code, tests, documentation, bug reports, and design feedback are welcome.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). By submitting a contribution, you agree that it may be distributed under the project's [MIT License](LICENSE).

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Use a GitHub Discussion or issue for support questions; follow [SECURITY.md](SECURITY.md) for vulnerabilities.
- Open an issue before a large feature, new preset, dependency change, or architectural change so the approach can be agreed before implementation.
- Keep modules absent from generated products when they are disabled.
- Never overwrite a changed managed file without reporting the conflict.

## Local setup

You need Node.js 24, pnpm 9, and Docker with Compose.

```sh
git clone https://github.com/ChristianRelf/Stackiln.git
cd Stackiln
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm lint
```

On Windows PowerShell, use `pnpm.cmd` when the execution policy blocks `pnpm.ps1`.

## Making a change

1. Create a focused branch from `main`.
2. Add or update tests for observable behaviour.
3. Update documentation and fixtures when public behaviour changes.
4. Use `--plan` for read-only generator inspection and apply generated changes through staging.
5. Run `pnpm verify`. This requires Docker and exercises the framework, fixtures, PostgreSQL migrations, browser journeys, and container.
6. Add an entry under `Unreleased` in [CHANGELOG.md](CHANGELOG.md) for user-visible changes.

For module-specific rules, read [docs/module-authoring.md](docs/module-authoring.md). Keep commits small and descriptive; Conventional Commit-style subjects such as `feat:`, `fix:`, `docs:`, and `test:` are encouraged.

## Pull requests

Pull requests should explain the problem, the chosen approach, verification performed, and any compatibility or security impact. A maintainer may ask for changes or split an oversized contribution. Approval and passing required checks are needed before merge.

Small corrections may be merged directly. Significant decisions should be captured in `docs/decisions/` so future contributors can understand the constraint, not only the code.
