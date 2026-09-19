# Deployment

The marketing fixture supports managed Next.js hosting and a non-root Node container. Install with its lockfile, provide `DATABASE_URL`, `APP_URL`, and production provider settings, run `pnpm db:migrate` once as a release step, then start the app. The Dockerfile builds a Next.js standalone image with health routes. The factory's `pnpm verify` builds and probes that image against local PostgreSQL.

Production email requires `RESEND_API_KEY`, `EMAIL_FROM`, and `CONTACT_EMAIL`. The product's legal copy must be reviewed before publication. Back up PostgreSQL before destructive migrations; none are generated in the current marketing fixture.
