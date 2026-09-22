# Deployment

For managed Next.js hosting, install at the workspace root and build the `web` app with isolated preview credentials. For containers, build the root Dockerfile, run `pnpm db:migrate` as a single release operation, then roll out the image. Configure `DATABASE_URL` and `APP_URL`; never reuse production provider credentials in preview. Back up PostgreSQL before destructive migrations and verify restores regularly.
