# Product architecture

This is an independent Next.js App Router workspace. `apps/web` owns routes and product features; `packages/ui` owns shared primitives; `packages/db` owns PostgreSQL access and Drizzle migrations; `packages/config` validates configuration. All routes run server-side policy and validation. Modules are recorded in `.stackiln/state.json`.
