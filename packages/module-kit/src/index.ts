import type { ModuleName } from "../../config/src/index.js";

export type OwnedSurface = "files" | "routes" | "tables" | "env" | "permissions" | "events";
export type ModuleRecipe = {
  id: ModuleName;
  version: number;
  requires: readonly ModuleName[];
  recommends?: readonly ModuleName[];
  conflicts?: readonly ModuleName[];
  owns: Record<OwnedSurface, readonly string[]>;
  dependencies?: Readonly<Record<string, string>>;
  navigation?: readonly { label: string; href: string }[];
  components?: readonly { importPath: string; exportName: string }[];
  verification?: readonly string[];
  suspension: "deny-routes" | "disable-provider" | "not-supported";
  removal: "stateless" | "archive-required";
  docs: string;
};

export function defineModule<const T extends ModuleRecipe>(recipe: T): T {
  return recipe;
}
