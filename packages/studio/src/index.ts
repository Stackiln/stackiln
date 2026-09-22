import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  defineStackilnConfig,
  type StackilnConfig,
} from "../../config/src/index.js";
import {
  applyCreate,
  planCreate,
  stackilnRoot,
} from "../../generator/src/index.js";
import { blocks, pageRecipes } from "../../generator/src/block-registry.js";

const studioHtmlPath = fileURLToPath(new URL("./studio.html", import.meta.url));

function json(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(`${JSON.stringify(value)}\n`);
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) throw new Error("Studio request is too large.");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function localRequest(request: IncomingMessage): boolean {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    const hostname = new URL(origin).hostname;
    return hostname === "127.0.0.1" || hostname === "localhost";
  } catch {
    return false;
  }
}

function initialConfig(destination: string): StackilnConfig {
  const fallback = basename(destination)
    .replaceAll(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
  return defineStackilnConfig({
    product: {
      name: fallback || "New Site",
      description: "A distinctive site built locally with Stackiln Studio.",
    },
    preset: "marketing",
  });
}

export type StudioOptions = {
  destination: string;
  port?: number;
  draftRoot?: string;
};

export async function startStudio({
  destination,
  port = 4173,
  draftRoot: configuredDraftRoot,
}: StudioOptions) {
  const target = resolve(destination);
  const draftRoot = configuredDraftRoot
    ? resolve(configuredDraftRoot)
    : join(stackilnRoot, ".stackiln-studio");
  const draftName = `${basename(target).replaceAll(/[^a-zA-Z0-9_-]/g, "-") || "site"}.json`;
  const draftPath = join(draftRoot, draftName);
  let config = initialConfig(target);
  try {
    config = defineStackilnConfig(
      JSON.parse(await readFile(draftPath, "utf8")) as unknown,
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  let exporting = false;

  async function save(next: StackilnConfig): Promise<void> {
    await mkdir(draftRoot, { recursive: true });
    await writeFile(draftPath, `${JSON.stringify(next, null, 2)}\n`);
    config = next;
  }

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      if (request.method === "GET" && url.pathname === "/") {
        response.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "content-security-policy":
            "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
        });
        response.end(await readFile(studioHtmlPath, "utf8"));
        return;
      }
      if (request.method === "GET" && url.pathname === "/api/bootstrap") {
        json(response, 200, {
          destination: target,
          draftPath,
          config,
          selectedBlocks: config.blocks.length
            ? config.blocks
            : pageRecipes[config.pageRecipe],
          catalog: Object.values(blocks),
          recipes: pageRecipes,
        });
        return;
      }
      if (!localRequest(request)) {
        json(response, 403, { error: "Studio only accepts local requests." });
        return;
      }
      if (request.method === "PUT" && url.pathname === "/api/draft") {
        const next = defineStackilnConfig(await readJson(request));
        await save(next);
        json(response, 200, { saved: true, draftPath });
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/export") {
        if (exporting) {
          json(response, 409, { error: "An export is already running." });
          return;
        }
        exporting = true;
        try {
          const next = defineStackilnConfig(await readJson(request));
          await save(next);
          const plan = await planCreate(next);
          const state = await applyCreate(plan, target, { lockfile: true });
          json(response, 201, {
            directory: target,
            blocks: Object.keys(state.blocks),
            message: "Site exported successfully.",
          });
        } finally {
          exporting = false;
        }
        return;
      }
      json(response, 404, { error: "Not found." });
    } catch (error) {
      json(response, 400, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  await new Promise<void>((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolveListen();
    });
  });
  const address = server.address();
  const actualPort =
    typeof address === "object" && address ? address.port : port;
  return {
    server,
    url: `http://127.0.0.1:${actualPort}`,
    destination: target,
    draftPath,
  };
}
