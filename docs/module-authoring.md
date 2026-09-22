# Module authoring

Add a typed recipe in `packages/generator/src/registry.ts` and place its product-owned files under `modules/<id>/files`. List every copied file in `owns.files`, and declare routes, tables, environment names, permissions, and events. The planner rejects mismatched file ownership and collisions. Give the module a suspension and removal strategy even when operations are not yet enabled. Add fixture tests for its actual user journey, then run `pnpm verify`.

Modules adding database tables must export their schema through `schemaExports` and include a checked-in Drizzle SQL migration and snapshot in `owns.files`. Declare the journal entry under `migrations`. Generate the migration against a product with all required modules enabled, then verify that a freshly generated product runs `pnpm db:migrate` without `db:generate` and that a subsequent `db:generate` reports no changes.
