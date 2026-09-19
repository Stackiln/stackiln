# Generated product

1. Copy `.env.example` to `.env.local` and set local values.
2. Run `docker compose up -d db`.
3. Run `pnpm install`, `pnpm db:migrate`, then `pnpm dev`.
4. Open http://localhost:3000.

Run `pnpm verify` for typecheck, tests, and a production build. Managed hosting can build `apps/web` with the root workspace install. For containers, build the included `Dockerfile`; run migrations as a separate release step.

Local contact messages are written to `apps/web/.local-mailbox`. In a container test environment, the default is `/tmp/site-factory-mailbox`; set `LOCAL_MAILBOX_DIR` to persist them elsewhere. Production email requires Resend credentials.
