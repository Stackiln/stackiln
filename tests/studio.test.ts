import { afterEach, expect, test } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startStudio } from "../packages/studio/src/index.js";

const temporary: string[] = [];
afterEach(async () => {
  for (const path of temporary.splice(0))
    await rm(path, { recursive: true, force: true });
});

test("studio serves the live catalogue and saves a validated local draft", async () => {
  const root = await mkdtemp(join(tmpdir(), "stackiln-studio-test-"));
  temporary.push(root);
  const studio = await startStudio({
    destination: join(root, "exported-site"),
    draftRoot: join(root, "drafts"),
    port: 0,
  });
  try {
    const bootstrapResponse = await fetch(`${studio.url}/api/bootstrap`);
    expect(bootstrapResponse.status).toBe(200);
    const bootstrap = (await bootstrapResponse.json()) as {
      catalog: unknown[];
      selectedBlocks: string[];
      config: Record<string, unknown>;
    };
    expect(bootstrap.catalog).toHaveLength(60);
    expect(bootstrap.selectedBlocks).toHaveLength(10);

    const blocked = await fetch(`${studio.url}/api/draft`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
      },
      body: JSON.stringify(bootstrap.config),
    });
    expect(blocked.status).toBe(403);

    const config = {
      ...bootstrap.config,
      product: { name: "Studio Draft", description: "Edited locally" },
      blocks: ["hero.centered", "cta.card"],
      blockContent: {
        "hero.centered": { title: "Designed in the browser" },
      },
    };
    const saved = await fetch(`${studio.url}/api/draft`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        origin: studio.url,
      },
      body: JSON.stringify(config),
    });
    expect(saved.status).toBe(200);
    expect(JSON.parse(await readFile(studio.draftPath, "utf8"))).toMatchObject({
      product: { name: "Studio Draft" },
      blocks: ["hero.centered", "cta.card"],
    });
  } finally {
    await new Promise<void>((resolveClose, reject) =>
      studio.server.close((error) => (error ? reject(error) : resolveClose())),
    );
  }
});
