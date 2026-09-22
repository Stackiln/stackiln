# Upgrading

Generated products record the StackKiln version, recipe versions, and managed-file checksums in `.stackkiln/state.json`. `pnpm stackkiln doctor <product>` reports changed managed files. Automatic upgrade and conflict proposals are not implemented yet; do not replace customised files by copying a newer template over them. Back up the product and review differences manually until upgrade operations are available.
