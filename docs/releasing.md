# Releasing StackKiln

StackKiln uses Semantic Versioning. Until the package surfaces are compiled and publishable, releases are source releases on GitHub and the workspace packages remain private.

## Release checklist

1. Confirm `main` is clean and all intended changes are reviewed.
2. Move relevant `Unreleased` entries in `CHANGELOG.md` under a dated version heading and update comparison links.
3. Update the root and package versions, `stackKilnVersion`, `CITATION.cff`, and generated fixtures together.
4. Run `pnpm install --frozen-lockfile` and the full `pnpm verify` gate with Docker running.
5. Confirm both fixture doctor checks report no changed managed files.
6. Create an annotated `vX.Y.Z` tag and push it.
7. Create a GitHub release from the changelog entry and identify breaking changes, migrations, and known limitations.
8. Verify the source archive contains `LICENSE`, community files, brand assets, and no credentials or generated local state.

Do not publish the internal workspace packages to npm until their TypeScript build, package exports, provenance, and clean-install smoke test are implemented and reviewed.
