# Architecture

`packages/config` validates product identity and options. `packages/module-kit` defines module ownership. `packages/generator` resolves presets and dependencies, checks collisions, plans exact files, and writes staged products. `packages/cli` presents those operations. `templates/base` is the smallest independently deployable Next.js product. `modules/*` contribute code only when selected.
