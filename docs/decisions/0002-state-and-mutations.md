# 0002: Transactional state and managed files

The planning function performs no writes. Create applies to a sibling staging directory, validates checksums, then renames it into place. A failed apply removes only its own staging directory. `.stackkiln/state.json` records recipe versions and SHA-256 hashes after success. Next.js owns `next-env.d.ts`, so it is excluded from managed checksums. Future add and upgrade operations must compare current hashes before modifying product-owned files.
