# Product architecture

This product deploys without the factory. Use `pnpm dev` locally and `pnpm verify` before a release. Keep provider calls in adapters, validate boundary input, and enforce policy on the server. Review `.factory/state.json` before upgrades. Never edit the recorded hashes manually.
