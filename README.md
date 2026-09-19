# Site Factory

A TypeScript CLI that generates standalone Next.js products from a base template and selected modules. The marketing preset and an optional accounts module are implemented and verified. Other presets are reserved in the manifest schema; requesting one currently reports which required module is missing.

## Quick start

Requirements: Node.js 24, pnpm 9, Docker Desktop (or Docker Engine with Compose). On Windows PowerShell, use `pnpm.cmd` if the script execution policy blocks `pnpm.ps1`.

```sh
pnpm install
pnpm factory create my-product --preset marketing --name "My Product" --description "A clear description of this product"
cd my-product
pnpm install --frozen-lockfile
docker compose up -d --wait db
pnpm db:migrate
pnpm dev
```

The app runs at http://localhost:3000. Set `CONTACT_EMAIL` for local contact submissions. Local messages are stored under `apps/web/.local-mailbox`. See the generated `.env.example` for all provider settings.

To add verified email/password accounts to a marketing product, pass `--module accounts` to `factory create`. Set `BETTER_AUTH_SECRET` to a unique random value of at least 32 characters before running the generated app. The accounts recipe includes its Drizzle migration; the same `pnpm db:migrate` step applies. Local verification, recovery, email-change, and deletion messages are written to the development mailbox. This optional module does not yet make the personal SaaS preset complete.

Run `pnpm verify` at the factory root for factory tests, both fixture installs and PostgreSQL migrations, generated-app checks, desktop and mobile browser tests, and a marketing container smoke test. The independent generated fixtures are at `fixtures/generated/marketing` and `fixtures/generated/accounts`.

Use `pnpm factory create <directory> --preset marketing --name "Name" --description "Description" --plan` to inspect changes without writing files. `pnpm factory inspect <directory>`, `doctor`, and `context` read a generated product. `pnpm factory verify` runs the canonical root verification command.

Current implementation and remaining phases are tracked in `docs/build-progress.md`.
