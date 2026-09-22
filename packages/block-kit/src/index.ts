import type { BlockName, ModuleName } from "../../config/src/index.js";

export type BlockCategory =
  | "navigation"
  | "hero"
  | "proof"
  | "features"
  | "story"
  | "media"
  | "cta"
  | "pricing"
  | "testimonials"
  | "faq"
  | "forms"
  | "footer";

export type BlockRecipe = {
  id: BlockName;
  version: number;
  category: BlockCategory;
  label: string;
  description: string;
  items: readonly string[];
  variant: string;
  exportName: string;
  requiresModules: readonly ModuleName[];
  rendering: "server" | "client";
  accessibility: readonly string[];
};

export function defineBlock<const T extends BlockRecipe>(recipe: T): T {
  return recipe;
}
