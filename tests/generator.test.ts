import { afterEach, expect, test } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineFactoryConfig } from "../packages/config/src/index.js";
import { applyCreate, planCreate, validateProduct } from "../packages/generator/src/index.js";

const temporary: string[] = [];
afterEach(async () => { for (const path of temporary.splice(0)) await rm(path, { recursive: true, force: true }); });
const config = defineFactoryConfig({ product: { name: "Reference Marketing", description: "A generated reference product" }, preset: "marketing" });

test("plan is deterministic and contains only enabled modules", async () => {
  const first = await planCreate(config);
  const second = await planCreate(config);
  expect(first.manifestHash).toBe(second.manifestHash);
  expect(first.files.map(file => file.destination)).toEqual(second.files.map(file => file.destination));
  expect(first.modules.map(module => module.id)).toEqual(["seo", "analytics", "cms", "email", "legal"].sort());
  expect(first.files.some(file => file.destination.includes("billing"))).toBe(false);
});

test("failed apply leaves no destination or state", async () => {
  const root = await mkdtemp(join(tmpdir(), "site-factory-test-")); temporary.push(root);
  const destination = join(root, "failed");
  const plan = await planCreate(config);
  await expect(applyCreate(plan, destination, { beforeCommit: async () => { throw new Error("simulated failure"); } })).rejects.toThrow("simulated failure");
  await expect(readFile(join(destination, ".factory/state.json"))).rejects.toThrow();
});

test("managed file modifications are detected", async () => {
  const root = await mkdtemp(join(tmpdir(), "site-factory-test-")); temporary.push(root);
  const destination = join(root, "product");
  const plan = await planCreate(config);
  await applyCreate(plan, destination);
  expect(await validateProduct(destination)).toEqual([]);
  await writeFile(join(destination, "apps/web/src/app/page.tsx"), "customised");
  expect(await validateProduct(destination)).toEqual(["apps/web/src/app/page.tsx"]);
});
