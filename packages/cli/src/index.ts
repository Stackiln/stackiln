#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  defineStackilnConfig,
  moduleNames,
  presetNames,
  type ModuleName,
  type PresetName,
} from "../../config/src/index.js";
import {
  applyCreate,
  stackilnRoot,
  formatPlan,
  planCreate,
  readState,
  validateProduct,
} from "../../generator/src/index.js";

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? undefined : args[index + 1];
}
function options(args: string[], name: string): string[] {
  return args.flatMap((value, index) =>
    value === `--${name}` && args[index + 1] ? [args[index + 1]!] : [],
  );
}
function help(): string {
  return `stackiln 0.1.0

Usage:
  pnpm stackiln create <directory> --preset marketing --name "Product Name" [--module accounts] [--description text] [--plan] [--json]
  pnpm stackiln inspect [directory] [--json]
  pnpm stackiln doctor [directory] [--json]
  pnpm stackiln context [directory]
  pnpm stackiln verify

Presets: ${presetNames.join(", ")}
Exit codes: 0 success, 1 failure, 2 invalid command or arguments.
`;
}
async function run(args: string[]): Promise<number> {
  const [command, ...rest] = args;
  if (!command || command === "--help" || command === "help") {
    process.stdout.write(help());
    return 0;
  }
  if (command === "create") {
    const directory = rest[0];
    const preset = (option(rest, "preset") ?? "marketing") as PresetName;
    const name = option(rest, "name") ?? directory;
    if (!directory || !name)
      throw new Error("create needs a directory and a product name");
    const selected = options(rest, "module");
    for (const item of selected)
      if (!moduleNames.includes(item as ModuleName))
        throw new Error(`Unknown module: ${item}`);
    const config = defineStackilnConfig({
      product: { name, description: option(rest, "description") ?? "" },
      preset,
      modules: Object.fromEntries(selected.map((item) => [item, true])),
    });
    const plan = await planCreate(config);
    if (rest.includes("--plan")) {
      process.stdout.write(
        rest.includes("--json")
          ? `${JSON.stringify(plan, null, 2)}\n`
          : `${formatPlan(plan)}\n`,
      );
      return 0;
    }
    const state = await applyCreate(plan, directory, { lockfile: true });
    process.stdout.write(
      rest.includes("--json")
        ? `${JSON.stringify({ directory: resolve(directory), state }, null, 2)}\n`
        : `Created ${resolve(directory)}\n${formatPlan(plan)}\n`,
    );
    return 0;
  }
  if (command === "inspect" || command === "doctor" || command === "context") {
    const root = resolve(rest[0] && !rest[0].startsWith("--") ? rest[0] : ".");
    const state = await readState(root);
    const config = JSON.parse(
      await readFile(join(root, "stackiln.config.json"), "utf8"),
    ) as { deployment: { target: string } };
    const changed = await validateProduct(root, state);
    if (command === "inspect") {
      const result = {
        preset: state.preset,
        modules: state.installed,
        stackilnVersion: state.stackilnVersion,
        deployment: config.deployment.target,
        changedManagedFiles: changed,
      };
      process.stdout.write(
        rest.includes("--json")
          ? `${JSON.stringify(result, null, 2)}\n`
          : `${JSON.stringify(result, null, 2)}\n`,
      );
      return 0;
    }
    if (command === "doctor") {
      const checks = {
        state: "ok",
        managedFiles: changed.length ? `changed: ${changed.join(", ")}` : "ok",
        databaseUrl: process.env.DATABASE_URL ? "configured" : "missing",
        appUrl: process.env.APP_URL ? "configured" : "missing",
      };
      process.stdout.write(`${JSON.stringify(checks, null, 2)}\n`);
      return changed.length ? 1 : 0;
    }
    const snapshot = `# Product context\nPreset: ${state.preset}\nModules: ${Object.keys(state.installed).join(", ")}\nDeployment: ${config.deployment.target}\nWeb: apps/web\nDatabase: packages/db\nUI: packages/ui\nChecks: pnpm verify\nChanged managed files: ${changed.join(", ") || "none"}\n`;
    if (rest.includes("--write"))
      await writeFile(join(root, "AGENT_CONTEXT.md"), snapshot);
    process.stdout.write(snapshot);
    return 0;
  }
  if (command === "verify") {
    const result = spawnSync(
      process.platform === "win32" ? "pnpm.cmd" : "pnpm",
      ["verify"],
      {
        cwd: stackilnRoot,
        stdio: "inherit",
        shell: process.platform === "win32",
      },
    );
    return result.status ?? 1;
  }
  throw new Error(
    `Unknown or unimplemented command: ${command}. Run --help for available commands.`,
  );
}
run(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 2;
  });
