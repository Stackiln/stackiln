import { z } from "zod";

export const presetNames = [
  "marketing",
  "personal-saas",
  "team-saas",
  "api-product",
  "marketplace",
  "membership",
  "internal-tool",
] as const;
export const moduleNames = [
  "seo",
  "analytics",
  "email",
  "cms",
  "legal",
  "accounts",
  "admin",
  "audit-log",
  "billing",
  "entitlements",
  "organisations",
  "rbac",
  "usage",
  "api",
  "jobs",
  "webhooks",
  "storage",
  "commerce",
  "marketplace",
  "notifications",
  "import-export",
] as const;
export const presetSchema = z.enum(presetNames);
export const moduleSchema = z.enum(moduleNames);
export const configSchema = z.object({
  product: z.object({
    name: z.string().min(1),
    description: z.string().default(""),
    defaultLocale: z.string().default("en-GB"),
    timezone: z.string().default("Europe/London"),
    currencies: z.array(z.string().length(3)).default(["GBP"]),
  }),
  preset: presetSchema,
  tenancy: z.enum(["personal", "organisation", "hybrid"]).default("personal"),
  brand: z
    .object({
      font: z.string().default("system"),
      radius: z.enum(["small", "medium", "large"]).default("medium"),
      density: z.enum(["compact", "comfortable"]).default("comfortable"),
      palette: z.string().default("neutral"),
      motion: z.enum(["none", "subtle"]).default("subtle"),
    })
    .prefault({}),
  modules: z
    .partialRecord(
      moduleSchema,
      z.union([z.boolean(), z.record(z.string(), z.unknown())]),
    )
    .default({}),
  deployment: z
    .object({
      target: z.enum(["container", "managed"]).default("container"),
      region: z.string().default("eu-west"),
    })
    .prefault({}),
  environment: z
    .enum(["local", "preview", "staging", "production"])
    .default("local"),
});

export type StackilnConfig = z.infer<typeof configSchema>;
export type PresetName = z.infer<typeof presetSchema>;
export type ModuleName = z.infer<typeof moduleSchema>;
export function defineStackilnConfig(
  input: z.input<typeof configSchema>,
): StackilnConfig {
  return configSchema.parse(input);
}
