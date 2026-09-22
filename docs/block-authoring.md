# Block authoring

Blocks are selectable, product-owned page sections. Modules provide capabilities such as email or accounts; blocks present those capabilities. Page recipes compose ordered blocks into a useful starting page.

## Catalogue and recipes

The public identifiers live in `packages/config/src/index.ts`. Metadata and page recipes live in `packages/generator/src/block-registry.ts`. Every identifier must have exactly one registry entry. Keep identifiers stable after release; visual alternatives belong in the recipe's `variant`, while a materially different information architecture should be a new block family.

`stackiln blocks list` prints the catalogue, `stackiln blocks show <id>` describes one entry, and `stackiln recipes list` prints available compositions. Repeated `--block` flags replace the selected recipe during creation. With no explicit blocks, the configured page recipe supplies the ordered selection.

## Generation model

Block components are materialised as ordinary React source under `apps/web/src/blocks`. The generated home page imports only the resolved selection and preserves its order. Both component source and the page assembler are included in the read-only plan before staging starts, then recorded in `.stackiln/state.json` with ownership hashes.

A block may declare required modules. Planning must fail if a required module is disabled; blocks must not silently enable product capabilities. Unselected blocks contribute no component files. Generated products never import Stackiln at runtime.

## Adding a block

1. Add a stable identifier to `blockNames`.
2. Add its label, description, category, variant, sample items, rendering mode, accessibility contract, and required modules to the registry.
3. Include it in a page recipe only when the resulting composition has a clear narrative.
4. Add generator coverage for selection, absence, dependencies, deterministic output, and managed-file validation.
5. Exercise the block in the generated fixture at desktop and mobile widths.
6. Run `pnpm.cmd verify` and record the completed gate in `docs/build-progress.md`.

The current renderer supplies production-safe structural patterns and responsive styling. When a family gains specialised behaviour, keep server rendering by default, add a client boundary only around the interaction, and preserve a useful no-JavaScript presentation. Native elements such as `details`, links, and forms are preferred where they provide the required interaction.

## Quality contract

Every block must provide labelled structure, visible keyboard focus, reduced-motion behaviour, responsive layout, long-content tolerance, and valid heading hierarchy in its page recipe. Interactive blocks also need keyboard operation, useful loading and error states, and a server-enforced boundary for any mutation. Provider credentials and external service calls belong to modules, never presentational block source.
