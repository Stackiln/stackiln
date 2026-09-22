# Product architecture

This product deploys without StackKiln. Use `pnpm dev` locally and `pnpm verify` before a release. Keep provider calls in adapters, validate boundary input, and enforce policy on the server. Review `.stackkiln/state.json` before upgrades. Never edit the recorded hashes manually.
