import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  defineStackilnConfig,
  type StackilnConfig,
  type BlockName,
  type ModuleName,
} from "../../config/src/index.js";
import { modules, presets } from "./registry.js";
import type { ModuleRecipe, OwnedSurface } from "../../module-kit/src/index.js";
import type { BlockRecipe } from "../../block-kit/src/index.js";
import {
  blockFileName,
  blocks,
  pageRecipes,
  renderBlockSource,
} from "./block-registry.js";

export const stackilnRoot = resolve(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
export const stackilnVersion = "0.1.0";
export type PlannedFile = {
  source?: string;
  content?: string;
  destination: string;
  owner: string;
};
export type Plan = {
  config: StackilnConfig;
  modules: ModuleRecipe[];
  blocks: BlockRecipe[];
  files: PlannedFile[];
  dependencies: Record<string, string>;
  warnings: string[];
  manifestHash: string;
};
export type StackilnState = {
  format: 1;
  stackilnVersion: string;
  preset: string;
  manifestHash: string;
  installed: Record<
    string,
    { version: number; status: "active" | "suspended" }
  >;
  blocks: Record<string, { version: number }>;
  applied: string[];
  managedFiles: Record<string, { owner: string; sha256: string }>;
  conflicts: string[];
};

function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
async function filesUnder(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await filesUnder(path)));
    else if (entry.isFile()) result.push(path);
  }
  return result.sort();
}
function resolveModules(config: StackilnConfig): ModuleRecipe[] {
  const selected = new Set<ModuleName>(presets[config.preset]);
  for (const [name, setting] of Object.entries(config.modules) as [
    ModuleName,
    unknown,
  ][]) {
    if (setting === false) selected.delete(name);
    else selected.add(name);
  }
  const ordered: ModuleRecipe[] = [];
  const pending = new Set<ModuleName>();
  const done = new Set<ModuleName>();
  function visit(id: ModuleName): void {
    if (done.has(id)) return;
    if (pending.has(id))
      throw new Error(
        `Module dependency cycle: ${[...pending, id].join(" -> ")}`,
      );
    const recipe = modules[id];
    if (!recipe)
      throw new Error(
        `Module ${id} is not implemented yet. Choose a supported preset or remove it.`,
      );
    pending.add(id);
    for (const required of recipe.requires) {
      if (config.modules[required] === false)
        throw new Error(
          `${id} requires ${required}; enable ${required} or disable ${id}.`,
        );
      visit(required);
    }
    pending.delete(id);
    done.add(id);
    ordered.push(recipe);
  }
  for (const id of [...selected].sort()) visit(id);
  for (const recipe of ordered)
    for (const conflict of recipe.conflicts ?? []) {
      if (done.has(conflict))
        throw new Error(`${recipe.id} conflicts with ${conflict}.`);
    }
  return ordered;
}
function checkCollisions(recipes: ModuleRecipe[]): void {
  for (const surface of [
    "files",
    "routes",
    "tables",
    "env",
    "permissions",
    "events",
  ] satisfies OwnedSurface[]) {
    const seen = new Map<string, string>();
    for (const recipe of recipes)
      for (const item of recipe.owns[surface]) {
        const owner = seen.get(item);
        if (owner)
          throw new Error(
            `${surface} collision: ${item} owned by ${owner} and ${recipe.id}`,
          );
        seen.set(item, recipe.id);
      }
  }
}
function resolveBlocks(
  config: StackilnConfig,
  resolvedModules: ModuleRecipe[],
): BlockRecipe[] {
  const selected = config.blocks.length
    ? config.blocks
    : pageRecipes[config.pageRecipe];
  const duplicate = selected.find(
    (id, index) => selected.indexOf(id) !== index,
  );
  if (duplicate) throw new Error(`Block selected more than once: ${duplicate}`);
  const moduleIds = new Set(resolvedModules.map((module) => module.id));
  return selected.map((id: BlockName) => {
    const block = blocks[id];
    if (!block) throw new Error(`Unknown block: ${id}`);
    for (const required of block.requiresModules)
      if (!moduleIds.has(required))
        throw new Error(`Block ${id} requires module ${required}.`);
    return block;
  });
}
function renderHomePage(selected: BlockRecipe[]): string {
  const imports = selected
    .map(
      (block, index) =>
        `import { ${block.exportName} as Block${index} } from "../blocks/${blockFileName(block.id)}";`,
    )
    .join("\n");
  const body = selected.map((_, index) => `      <Block${index} />`).join("\n");
  return `${imports}\n\nexport default function Home() {\n  return (\n    <>\n${body}\n    </>\n  );\n}\n`;
}
export async function planCreate(raw: unknown): Promise<Plan> {
  const config = defineStackilnConfig(
    raw as Parameters<typeof defineStackilnConfig>[0],
  );
  const resolved = resolveModules(config);
  checkCollisions(resolved);
  const resolvedBlocks = resolveBlocks(config, resolved);
  const base = join(stackilnRoot, "templates", "base");
  const files: PlannedFile[] = (await filesUnder(base))
    .map((source) => ({
      source,
      destination: relative(base, source).split(sep).join("/"),
      owner: "base",
    }))
    .filter((file) => file.destination !== "apps/web/src/app/page.tsx");
  for (const recipe of resolved) {
    const root = join(stackilnRoot, "modules", recipe.id, "files");
    const sourceFiles = await filesUnder(root);
    const actual = sourceFiles.map((source) =>
      relative(root, source).split(sep).join("/"),
    );
    if (stable(actual) !== stable([...recipe.owns.files].sort()))
      throw new Error(
        `${recipe.id} recipe file ownership does not match source files`,
      );
    for (const source of sourceFiles)
      files.push({
        source,
        destination: relative(root, source).split(sep).join("/"),
        owner: recipe.id,
      });
  }
  for (const block of resolvedBlocks)
    files.push({
      content: renderBlockSource(block),
      destination: `apps/web/src/blocks/${blockFileName(block.id)}.tsx`,
      owner: `block:${block.id}`,
    });
  files.push({
    content: renderHomePage(resolvedBlocks),
    destination: "apps/web/src/app/page.tsx",
    owner: "stackiln",
  });
  const paths = new Set<string>();
  for (const file of files) {
    if (paths.has(file.destination))
      throw new Error(`File collision: ${file.destination}`);
    paths.add(file.destination);
  }
  const dependencies: Record<string, string> = {};
  for (const recipe of resolved)
    for (const [name, version] of Object.entries(recipe.dependencies ?? {})) {
      if (dependencies[name] && dependencies[name] !== version)
        throw new Error(`Dependency version conflict: ${name}`);
      dependencies[name] = version;
    }
  return {
    config,
    modules: resolved,
    blocks: resolvedBlocks,
    files: files.sort((a, b) => a.destination.localeCompare(b.destination)),
    dependencies,
    warnings: [],
    manifestHash: sha256(
      stable({
        config,
        modules: resolved.map((item) => [item.id, item.version]),
        blocks: resolvedBlocks.map((item) => [item.id, item.version]),
      }),
    ),
  };
}
export function formatPlan(plan: Plan): string {
  const composition = plan.config.blocks.length
    ? "custom"
    : plan.config.pageRecipe;
  return [
    `Product: ${plan.config.product.name}`,
    `Preset: ${plan.config.preset}`,
    `Modules: ${plan.modules.map((module) => module.id).join(", ")}`,
    `Page recipe: ${composition}`,
    `Blocks (${plan.blocks.length}): ${plan.blocks.map((block) => block.id).join(", ")}`,
    `Template and module files: ${plan.files.length}`,
    `Dependencies: ${Object.keys(plan.dependencies).join(", ") || "none"}`,
    ...plan.warnings.map((warning) => `Warning: ${warning}`),
  ].join("\n");
}
async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}
export async function applyCreate(
  plan: Plan,
  destination: string,
  options: { beforeCommit?: () => Promise<void>; lockfile?: boolean } = {},
): Promise<StackilnState> {
  const target = resolve(destination);
  try {
    await stat(target);
    throw new Error(`Destination already exists: ${target}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const stage = `${target}.stackiln-stage-${process.pid}-${Math.random().toString(36).slice(2)}`;
  const managedFiles: StackilnState["managedFiles"] = {};
  try {
    await mkdir(stage, { recursive: true });
    for (const file of plan.files) {
      const output = join(stage, file.destination);
      await mkdir(dirname(output), { recursive: true });
      if (file.content !== undefined) await writeFile(output, file.content);
      else if (file.source) await copyFile(file.source, output);
      else throw new Error(`Planned file has no source: ${file.destination}`);
      if (file.destination !== "apps/web/next-env.d.ts")
        managedFiles[file.destination] = {
          owner: file.owner,
          sha256: sha256(await readFile(output)),
        };
    }
    const packagePath = join(stage, "apps/web/package.json");
    const webPackage = JSON.parse(await readFile(packagePath, "utf8")) as {
      dependencies: Record<string, string>;
    };
    webPackage.dependencies = Object.fromEntries(
      Object.entries({ ...webPackage.dependencies, ...plan.dependencies }).sort(
        ([a], [b]) => a.localeCompare(b),
      ),
    );
    await writeJson(packagePath, webPackage);
    managedFiles["apps/web/package.json"] = {
      owner: "base",
      sha256: sha256(await readFile(packagePath)),
    };
    const envPath = join(stage, ".env.example");
    const moduleEnv = [
      ...new Set(plan.modules.flatMap((module) => module.owns.env)),
    ].sort();
    await writeFile(
      envPath,
      `${await readFile(envPath, "utf8")}${moduleEnv.map((name) => `${name}=\n`).join("")}`,
    );
    managedFiles[".env.example"] = {
      owner: "base",
      sha256: sha256(await readFile(envPath)),
    };
    await writeJson(join(stage, "stackiln.config.json"), plan.config);
    await writeJson(join(stage, "apps/web/product-config.json"), plan.config);
    const components = plan.modules.flatMap(
      (module) => module.components ?? [],
    );
    const navigation = plan.modules.flatMap(
      (module) => module.navigation ?? [],
    );
    const componentSource = components
      .map(
        (item, index) =>
          `import { ${item.exportName} as Component${index} } from ${JSON.stringify(item.importPath)};`,
      )
      .join("\n");
    const componentBody = components.length
      ? `<>${components.map((_, index) => `<Component${index} />`).join("")}</>`
      : "null";
    await mkdir(join(stage, "apps/web/src/components"), { recursive: true });
    await writeFile(
      join(stage, "apps/web/src/components/enabled.tsx"),
      `${componentSource}\nexport function EnabledComponents() { return ${componentBody}; }\n`,
    );
    const mainLinks = navigation
      .filter((item) => item.area === "main")
      .map(({ label, href }) => ({ label, href }));
    const legalLinks = navigation
      .filter((item) => item.area === "legal")
      .map(({ label, href }) => ({ label, href }));
    await writeFile(
      join(stage, "apps/web/src/components/navigation.tsx"),
      `import Link from "next/link";\nconst main: { label: string; href: string }[] = ${JSON.stringify(mainLinks)};\nconst legal: { label: string; href: string }[] = ${JSON.stringify(legalLinks)};\nexport function MainNavigation() { return main.length ? <nav aria-label="Main navigation">{main.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav> : null; }\nexport function LegalNavigation() { return legal.length ? <nav aria-label="Legal">{legal.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav> : null; }\n`,
    );
    const schemaExports = plan.modules.flatMap(
      (module) => module.schemaExports ?? [],
    );
    await writeFile(
      join(stage, "packages/db/src/enabled-schema.ts"),
      schemaExports.length
        ? `${schemaExports.map((path) => `export * from ${JSON.stringify(path)};`).join("\n")}\n`
        : "export {};\n",
    );
    const journalPath = join(stage, "packages/db/drizzle/meta/_journal.json");
    const journal = JSON.parse(await readFile(journalPath, "utf8")) as {
      version: string;
      entries: {
        idx: number;
        version: string;
        when: number;
        tag: string;
        breakpoints: boolean;
      }[];
    };
    for (const migration of plan.modules.flatMap(
      (module) => module.migrations ?? [],
    )) {
      if (journal.entries.some((entry) => entry.tag === migration.tag))
        throw new Error(`Migration collision: ${migration.tag}`);
      journal.entries.push({
        idx: journal.entries.length,
        version: journal.version,
        when: migration.when,
        tag: migration.tag,
        breakpoints: true,
      });
    }
    if (journal.entries.length > 1) {
      await writeJson(journalPath, journal);
      managedFiles["packages/db/drizzle/meta/_journal.json"] = {
        owner: "stackiln",
        sha256: sha256(await readFile(journalPath)),
      };
    }
    await writeJson(join(stage, "apps/web/routes.json"), [
      "/",
      ...new Set(navigation.map((item) => item.href)),
    ]);
    await writeFile(
      join(stage, "stackiln.config.ts"),
      'import { defineProductConfig } from "./packages/config/src/index";\nimport config from "./stackiln.config.json";\nexport default defineProductConfig(config);\n',
    );
    await writeFile(
      join(stage, "resolved-manifest.md"),
      `${formatPlan(plan)}\n`,
    );
    const moduleDocs = plan.modules
      .map(
        (module) =>
          `## ${module.id}\n\n${module.docs}\n\nRoutes: ${module.owns.routes.join(", ") || "none"}. Tables: ${module.owns.tables.join(", ") || "none"}.\n`,
      )
      .join("\n");
    await writeFile(
      join(stage, "docs/modules.md"),
      `# Enabled modules\n\n${moduleDocs}`,
    );
    const blockDocs = plan.blocks
      .map(
        (block, index) =>
          `${index + 1}. **${block.label}** (\`${block.id}\`, ${block.variant}) — ${block.description}`,
      )
      .join("\n");
    await writeFile(
      join(stage, "docs/blocks.md"),
      `# Home page blocks\n\nRecipe: ${plan.config.blocks.length ? "custom selection" : plan.config.pageRecipe}.\n\n${blockDocs}\n`,
    );
    await writeFile(
      join(stage, "docs/routes.md"),
      `# Routes\n\n${plan.modules.flatMap((module) => module.owns.routes.map((route) => `- ${route} (${module.id})`)).join("\n")}\n`,
    );
    await writeFile(
      join(stage, "docs/events.md"),
      `# Events\n\n${plan.modules.flatMap((module) => module.owns.events.map((event) => `- ${event} (${module.id})`)).join("\n")}\n`,
    );
    const permissions = plan.modules.flatMap((module) =>
      module.owns.permissions.map(
        (permission) => `- ${permission} (${module.id})`,
      ),
    );
    await writeFile(
      join(stage, "docs/permissions.md"),
      permissions.length
        ? `# Permissions\n\n${permissions.join("\n")}\n`
        : "# Permissions\n",
    );
    for (const name of [
      "stackiln.config.json",
      "stackiln.config.ts",
      "resolved-manifest.md",
      "apps/web/product-config.json",
      "apps/web/routes.json",
      "apps/web/src/components/enabled.tsx",
      "apps/web/src/components/navigation.tsx",
      "packages/db/src/enabled-schema.ts",
      "docs/modules.md",
      "docs/blocks.md",
      "docs/routes.md",
      "docs/events.md",
      "docs/permissions.md",
    ])
      managedFiles[name] = {
        owner: "stackiln",
        sha256: sha256(await readFile(join(stage, name))),
      };
    if (options.lockfile) {
      const result = spawnSync(
        process.platform === "win32" ? "pnpm.cmd" : "pnpm",
        ["install", "--lockfile-only", "--ignore-scripts"],
        { cwd: stage, encoding: "utf8", shell: process.platform === "win32" },
      );
      if (result.status !== 0)
        throw new Error(
          `Could not generate product lockfile: ${result.stderr || result.stdout}`,
        );
      managedFiles["pnpm-lock.yaml"] = {
        owner: "stackiln",
        sha256: sha256(await readFile(join(stage, "pnpm-lock.yaml"))),
      };
    }
    const state: StackilnState = {
      format: 1,
      stackilnVersion,
      preset: plan.config.preset,
      manifestHash: plan.manifestHash,
      installed: Object.fromEntries(
        plan.modules.map((module) => [
          module.id,
          { version: module.version, status: "active" },
        ]),
      ),
      blocks: Object.fromEntries(
        plan.blocks.map((block) => [block.id, { version: block.version }]),
      ),
      applied: [],
      managedFiles: Object.fromEntries(
        Object.entries(managedFiles).sort(([a], [b]) => a.localeCompare(b)),
      ),
      conflicts: [],
    };
    await writeJson(join(stage, ".stackiln/state.json"), state);
    const changed = await validateProduct(stage, state);
    if (changed.length)
      throw new Error(
        `Staged product failed checksum validation: ${changed.join(", ")}`,
      );
    await options.beforeCommit?.();
    await rename(stage, target);
    return state;
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}
export async function readState(root: string): Promise<StackilnState> {
  const state = JSON.parse(
    await readFile(join(root, ".stackiln/state.json"), "utf8"),
  ) as StackilnState;
  if (state.format !== 1)
    throw new Error(
      `Unsupported Stackiln state format: ${String(state.format)}`,
    );
  return state;
}
export async function validateProduct(
  root: string,
  knownState?: StackilnState,
): Promise<string[]> {
  const state = knownState ?? (await readState(root));
  const changed: string[] = [];
  for (const [path, record] of Object.entries(state.managedFiles)) {
    try {
      if (sha256(await readFile(join(root, path))) !== record.sha256)
        changed.push(path);
    } catch {
      changed.push(path);
    }
  }
  return changed;
}
