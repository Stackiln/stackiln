# Upgrading

Generated products record the factory version, recipe versions, and managed-file checksums in `.factory/state.json`. `pnpm factory doctor <product>` reports changed managed files. Automatic upgrade and conflict proposals are not implemented yet; do not replace customised files by copying a newer template over them. Back up the product and review differences manually until upgrade operations are available.
