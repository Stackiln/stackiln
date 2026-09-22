# Architecture

`packages/config` validates product identity and options. `packages/module-kit` defines module ownership. `packages/generator` resolves presets and dependencies, checks collisions, plans exact files, and writes staged products. `packages/cli` presents those operations. `templates/base` is the smallest independently deployable Next.js product. `modules/*` contribute code only when selected.

Stackiln is a build-time tool, not a runtime framework. A generated product contains copied source, its resolved configuration, and `.stackiln/state.json`; it does not import Stackiln in production. This keeps deployment conventional and lets product teams take full ownership of the output.
