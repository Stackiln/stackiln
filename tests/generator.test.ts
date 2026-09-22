import { afterEach, expect, test } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  blockNames,
  defineStackilnConfig,
} from "../packages/config/src/index.js";
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

test("the public block catalogue and default page recipe are planned exactly", async () => {
  expect(blockNames).toHaveLength(60);
  const plan = await planCreate(config);
  expect(plan.blocks).toHaveLength(10);
  expect(plan.blocks.map((block) => block.id)).toContain("hero.split-image");
  expect(
    plan.files.filter((file) => file.owner.startsWith("block:")),
  ).toHaveLength(10);
  const home = plan.files.find(
    (file) => file.destination === "apps/web/src/app/page.tsx",
  );
  expect(home?.owner).toBe("stackiln");
  expect(home?.content).toContain("HeroSplitImageBlock");
});

test("explicit blocks replace the page recipe and leave unselected block files absent", async () => {
  const selected = await planCreate(
    defineStackilnConfig({
      product: { name: "Focused" },
      preset: "marketing",
      blocks: ["hero.centered", "features.bento-grid"],
    }),
  );
  expect(selected.blocks.map((block) => block.id)).toEqual([
    "hero.centered",
    "features.bento-grid",
  ]);
  const root = await mkdtemp(join(tmpdir(), "stackiln-blocks-"));
  temporary.push(root);
  const destination = join(root, "product");
  const state = await applyCreate(selected, destination);
  expect(Object.keys(state.blocks)).toEqual([
    "hero.centered",
    "features.bento-grid",
  ]);
  const home = await readFile(
    join(destination, "apps/web/src/app/page.tsx"),
    "utf8",
  );
  expect(home).toContain("hero-centered");
  expect(home).not.toContain("pricing-cards");
  await expect(
    readFile(
      join(destination, "apps/web/src/blocks/pricing-cards.tsx"),
      "utf8",
    ),
  ).rejects.toThrow();
  expect(await validateProduct(destination)).toEqual([]);
});

test("blocks cannot bypass required modules", async () => {
  await expect(
    planCreate({
      product: { name: "No Email" },
      preset: "marketing",
      modules: { email: false },
      blocks: ["forms.contact"],
    }),
  ).rejects.toThrow("Block forms.contact requires module email.");
});

test("brand and block content become product-owned generated source", async () => {
  const plan = await planCreate({
    product: { name: "Distinctive" },
    preset: "marketing",
    brand: {
      palette: "violet",
      font: "editorial",
      radius: "large",
      density: "compact",
    },
    blocks: ["hero.centered"],
    blockContent: {
      "hero.centered": {
        eyebrow: "Made differently",
        title: "A genuinely specific proposition",
        description: "Copy written for this product rather than the template.",
        items: ["First truth", "Second truth"],
      },
    },
  });
  const block = plan.files.find((file) =>
    file.destination.endsWith("hero-centered.tsx"),
  );
  const theme = plan.files.find((file) =>
    file.destination.endsWith("theme.css"),
  );
  expect(block?.content).toContain("A genuinely specific proposition");
  expect(block?.content).toContain("First truth");
  expect(theme?.content).toContain("--action: #6842b8");
  expect(theme?.content).toContain('Georgia, "Times New Roman", serif');
  expect(theme?.content).toContain("--section-space: 3.5rem");
});
