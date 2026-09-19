# Build progress

## Phase 0: repository and architecture

Status: in progress.

Gate: clean install; lint, typecheck, unit tests; parse real manifests and module contracts.

## Phase 1: reliable core generator

Status: pending.

Gate: deterministic marketing fixture; clean install, migration, typecheck, tests, build, container smoke test; failed apply leaves no state.

## Phases 2-7

Status: pending. Accounts, billing, analytics, advanced modules, commerce, and release matrix are not yet verified.

## Decisions

- Generate independent product directories by copying product-owned source.
- Plan module ownership and dependency changes before writing.
- Write into a sibling staging directory and rename only after structural checks.
- Track SHA-256 hashes for every managed file.

## Environment blockers

- Docker Desktop daemon is stopped, so PostgreSQL and container checks require starting it.

## Continuation

From repository root, run `pnpm.cmd install`, `pnpm.cmd verify`, then `pnpm.cmd factory create fixtures/generated/marketing --preset marketing --name "Reference Marketing"`.
