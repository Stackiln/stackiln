import { z } from "zod";

export const productConfigSchema = z.object({
  product: z.object({
    name: z.string().min(1),
    description: z.string(),
    defaultLocale: z.string(),
    timezone: z.string(),
    currencies: z.array(z.string()),
  }),
  preset: z.string(),
  tenancy: z.enum(["personal", "organisation", "hybrid"]),
  brand: z.object({
    font: z.string(),
    radius: z.string(),
    density: z.string(),
    palette: z.string(),
    motion: z.string(),
  }),
  modules: z.record(z.string(), z.unknown()),
  pageRecipe: z.string(),
  blocks: z.array(z.string()),
  deployment: z.object({
    target: z.enum(["container", "managed"]),
    region: z.string(),
  }),
  environment: z.enum(["local", "preview", "staging", "production"]),
});
export function defineProductConfig(input: unknown) {
  return productConfigSchema.parse(input);
}
