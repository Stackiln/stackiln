import type { ModuleName, PresetName } from "../../config/src/index.js";
import { defineModule, type ModuleRecipe } from "../../module-kit/src/index.js";

const own = (files: string[] = [], routes: string[] = [], tables: string[] = [], env: string[] = [], permissions: string[] = [], events: string[] = []) => ({ files, routes, tables, env, permissions, events });

export const modules: Partial<Record<ModuleName, ModuleRecipe>> = {
  seo: defineModule({ id: "seo", version: 1, requires: [], owns: own(["apps/web/src/app/sitemap.ts", "apps/web/src/app/robots.ts", "apps/web/src/app/not-found.tsx"]), suspension: "not-supported", removal: "stateless", docs: "Metadata, sitemap, robots and unavailable states." }),
  analytics: defineModule({ id: "analytics", version: 1, requires: [], owns: own(["apps/web/src/lib/analytics.ts", "apps/web/src/components/consent.tsx"], [], [], ["NEXT_PUBLIC_POSTHOG_KEY"], [], ["page.viewed"]), components: [{ importPath: "./consent", exportName: "Consent" }], suspension: "disable-provider", removal: "stateless", docs: "Consent-gated browser events with a local sink." }),
  email: defineModule({ id: "email", version: 1, requires: [], owns: own(["apps/web/src/lib/email.ts", "apps/web/src/app/api/contact/route.ts", "apps/web/src/app/contact/page.tsx"], ["/contact", "/api/contact"], [], ["RESEND_API_KEY", "CONTACT_EMAIL", "LOCAL_MAILBOX_DIR"], [], ["contact.submitted"]), suspension: "disable-provider", removal: "stateless", docs: "Validated contact endpoint with local and Resend adapters.", dependencies: { resend: "^6.0.0" } }),
  cms: defineModule({ id: "cms", version: 1, requires: [], owns: own(["apps/web/src/content/pages.ts", "apps/web/src/app/features/page.tsx"] , ["/features"]), suspension: "not-supported", removal: "stateless", docs: "Local typed content." }),
  legal: defineModule({ id: "legal", version: 1, requires: [], owns: own(["apps/web/src/app/privacy/page.tsx", "apps/web/src/app/terms/page.tsx"], ["/privacy", "/terms"]), suspension: "not-supported", removal: "stateless", docs: "Product-owned legal page starters." })
};

export const presets: Record<PresetName, readonly ModuleName[]> = {
  marketing: ["seo", "analytics", "email", "cms", "legal"],
  "personal-saas": ["accounts", "email", "billing", "entitlements", "analytics", "admin", "audit-log"],
  "team-saas": ["accounts", "email", "billing", "entitlements", "analytics", "admin", "audit-log", "organisations", "rbac"],
  "api-product": ["accounts", "billing", "entitlements", "usage", "api", "jobs", "webhooks"],
  marketplace: ["accounts", "organisations", "commerce", "marketplace", "storage", "jobs"],
  membership: ["accounts", "billing", "entitlements", "cms", "email", "notifications"],
  "internal-tool": ["accounts", "rbac", "audit-log", "admin", "import-export"]
};
