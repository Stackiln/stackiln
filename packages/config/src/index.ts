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
export const blockNames = [
  "navigation.announcement-bar",
  "navigation.utility-bar",
  "navigation.centered-navbar",
  "navigation.split-navbar",
  "navigation.mega-menu",
  "hero.centered",
  "hero.split-image",
  "hero.product-mockup",
  "hero.video",
  "hero.search-led",
  "proof.logo-cloud",
  "proof.logo-marquee",
  "proof.press-mentions",
  "proof.star-ratings",
  "proof.customer-count",
  "features.icon-grid",
  "features.bento-grid",
  "features.alternating",
  "features.tabbed",
  "features.comparison",
  "story.editorial-intro",
  "story.rich-text",
  "story.image-copy",
  "story.timeline",
  "story.values",
  "media.masonry-gallery",
  "media.carousel",
  "media.lightbox",
  "media.browser-frame",
  "media.video-player",
  "cta.banner",
  "cta.split",
  "cta.card",
  "cta.floating",
  "cta.sticky",
  "pricing.cards",
  "pricing.billing-toggle",
  "pricing.comparison",
  "pricing.usage-calculator",
  "pricing.request-quote",
  "testimonials.cards",
  "testimonials.carousel",
  "testimonials.pull-quote",
  "testimonials.video",
  "testimonials.customer-story",
  "faq.accordion",
  "faq.grouped",
  "faq.searchable",
  "faq.escalation",
  "faq.glossary",
  "forms.contact",
  "forms.newsletter",
  "forms.waitlist",
  "forms.demo-request",
  "forms.quote-request",
  "footer.simple",
  "footer.mega",
  "footer.cta",
  "footer.newsletter",
  "footer.sitemap",
] as const;
export const pageRecipeNames = [
  "marketing-classic",
  "saas-launch",
  "editorial",
  "waitlist",
] as const;
export const presetSchema = z.enum(presetNames);
export const moduleSchema = z.enum(moduleNames);
export const blockSchema = z.enum(blockNames);
export const pageRecipeSchema = z.enum(pageRecipeNames);
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
  pageRecipe: pageRecipeSchema.default("marketing-classic"),
  blocks: z.array(blockSchema).default([]),
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
export type BlockName = z.infer<typeof blockSchema>;
export type PageRecipeName = z.infer<typeof pageRecipeSchema>;
export function defineStackilnConfig(
  input: z.input<typeof configSchema>,
): StackilnConfig {
  return configSchema.parse(input);
}
