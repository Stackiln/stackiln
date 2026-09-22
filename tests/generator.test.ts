import { afterEach, expect, test } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineStackilnConfig } from "../packages/config/src/index.js";
import {
  applyCreate,
  planCreate,
  validateProduct,
} from "../packages/generator/src/index.js";

const temporary: string[] = [];
afterEach(async () => {
  for (const path of temporary.splice(0))
    await rm(path, { recursive: true, force: true });
});
const config = defineStackilnConfig({
  product: {
    name: "Reference Marketing",
    description: "A generated reference product",
  },
  preset: "marketing",
});

test("plan is deterministic and contains only enabled modules", async () => {
  const first = await planCreate(config);
  const second = await planCreate(config);
  expect(first.manifestHash).toBe(second.manifestHash);
  expect(first.files.map((file) => file.destination)).toEqual(
    second.files.map((file) => file.destination),
  );
  expect(first.modules.map((module) => module.id)).toEqual(
    ["seo", "analytics", "cms", "email", "legal"].sort(),
  );
  expect(first.files.some((file) => file.destination.includes("billing"))).toBe(
    false,
  );
});

test("failed apply leaves no destination or state", async () => {
  const root = await mkdtemp(join(tmpdir(), "stackiln-test-"));
  temporary.push(root);
  const destination = join(root, "failed");
  const plan = await planCreate(config);
  await expect(
    applyCreate(plan, destination, {
      beforeCommit: async () => {
        throw new Error("simulated failure");
      },
    }),
  ).rejects.toThrow("simulated failure");
  await expect(
    readFile(join(destination, ".stackiln/state.json")),
  ).rejects.toThrow();
});

test("managed file modifications are detected", async () => {
  const root = await mkdtemp(join(tmpdir(), "stackiln-test-"));
  temporary.push(root);
  const destination = join(root, "product");
  const plan = await planCreate(config);
  await applyCreate(plan, destination);
  const state = JSON.parse(
    await readFile(join(destination, ".stackiln/state.json"), "utf8"),
  ) as { managedFiles: Record<string, unknown> };
  expect(state.managedFiles["apps/web/next-env.d.ts"]).toBeUndefined();
  expect(await validateProduct(destination)).toEqual([]);
  await writeFile(join(destination, "apps/web/src/app/page.tsx"), "customised");
  expect(await validateProduct(destination)).toEqual([
    "apps/web/src/app/page.tsx",
  ]);
});

test("identical inputs generate identical managed files", async () => {
  const root = await mkdtemp(join(tmpdir(), "stackiln-test-"));
  temporary.push(root);
  const plan = await planCreate(config);
  const first = await applyCreate(plan, join(root, "one"));
  const second = await applyCreate(plan, join(root, "two"));
  expect(first).toEqual(second);
});

test("accounts is optional and composes its schema without changing marketing", async () => {
  const marketing = await planCreate(config);
  expect(
    marketing.files.some((file) =>
      file.destination.endsWith("accounts-schema.ts"),
    ),
  ).toBe(false);
  const withAccounts = await planCreate(
    defineStackilnConfig({
      product: { name: "Accounts" },
      preset: "marketing",
      modules: { accounts: true },
    }),
  );
  expect(withAccounts.modules.map((module) => module.id)).toContain("accounts");
  const root = await mkdtemp(join(tmpdir(), "stackiln-test-"));
  temporary.push(root);
  const destination = join(root, "with-accounts");
  await applyCreate(withAccounts, destination);
  expect(
    await readFile(
      join(destination, "packages/db/src/enabled-schema.ts"),
      "utf8",
    ),
  ).toBe('export * from "./accounts-schema";\n');
  const journal = JSON.parse(
    await readFile(
      join(destination, "packages/db/drizzle/meta/_journal.json"),
      "utf8",
    ),
  ) as { entries: { tag: string }[] };
  expect(journal.entries.map((entry) => entry.tag)).toEqual([
    "0000_oval_wonder_man",
    "0001_accounts",
  ]);
  expect(await validateProduct(destination)).toEqual([]);
});
