import type { ModuleName, PresetName } from "../../config/src/index.js";
import { defineModule, type ModuleRecipe } from "../../module-kit/src/index.js";

const own = (files: string[] = [], routes: string[] = [], tables: string[] = [], env: string[] = [], permissions: string[] = [], events: string[] = []) => ({ files, routes, tables, env, permissions, events });

export const modules: Partial<Record<ModuleName, ModuleRecipe>> = {
  seo: defineModule({ id: "seo", version: 1, requires: [], owns: own(["apps/web/src/app/sitemap.ts", "apps/web/src/app/robots.ts", "apps/web/src/app/not-found.tsx"]), suspension: "not-supported", removal: "stateless", docs: "Metadata, sitemap, robots and unavailable states." }),
  analytics: defineModule({ id: "analytics", version: 1, requires: [], owns: own(["apps/web/src/lib/analytics.ts", "apps/web/src/components/consent.tsx"], [], [], ["NEXT_PUBLIC_POSTHOG_KEY"], [], ["page.viewed"]), components: [{ importPath: "./consent", exportName: "Consent" }], suspension: "disable-provider", removal: "stateless", docs: "Consent-gated browser events with a local sink." }),
  email: defineModule({ id: "email", version: 1, requires: [], owns: own(["apps/web/src/lib/email.ts", "apps/web/src/app/api/contact/route.ts", "apps/web/src/app/contact/page.tsx", "apps/web/src/app/contact/thanks/page.tsx", "apps/web/src/app/contact/error/page.tsx", "tests/e2e/contact.spec.ts"], ["/contact", "/contact/thanks", "/contact/error", "/api/contact"], [], ["RESEND_API_KEY", "CONTACT_EMAIL", "LOCAL_MAILBOX_DIR"], [], ["contact.submitted"]), navigation: [{ label: "Contact", href: "/contact", area: "main" }], suspension: "disable-provider", removal: "stateless", docs: "Validated contact endpoint with local and Resend adapters.", dependencies: { resend: "^6.0.0" } }),
  cms: defineModule({ id: "cms", version: 1, requires: [], owns: own(["apps/web/src/content/pages.ts", "apps/web/src/app/features/page.tsx"] , ["/features"]), navigation: [{ label: "Features", href: "/features", area: "main" }], suspension: "not-supported", removal: "stateless", docs: "Local typed content." }),
  legal: defineModule({ id: "legal", version: 1, requires: [], owns: own(["apps/web/src/app/privacy/page.tsx", "apps/web/src/app/terms/page.tsx"], ["/privacy", "/terms"]), navigation: [{ label: "Privacy", href: "/privacy", area: "legal" }, { label: "Terms", href: "/terms", area: "legal" }], suspension: "not-supported", removal: "stateless", docs: "Product-owned legal page starters." }),
  accounts: defineModule({ id: "accounts", version: 1, requires: ["email"], owns: own(["packages/db/src/accounts-schema.ts", "packages/db/drizzle/0001_accounts.sql", "packages/db/drizzle/meta/0001_snapshot.json", "apps/web/src/lib/auth.ts", "apps/web/src/lib/auth-client.ts", "apps/web/src/app/api/auth/[...all]/route.ts", "apps/web/src/app/api/account/export/route.ts", "apps/web/src/app/sign-in/page.tsx", "apps/web/src/app/sign-up/page.tsx", "apps/web/src/app/forgot-password/page.tsx", "apps/web/src/app/reset-password/page.tsx", "apps/web/src/app/account/page.tsx", "apps/web/src/app/account/account-actions.tsx", "apps/web/src/components/auth-form.tsx", "tests/e2e/accounts.spec.ts"], ["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/account", "/api/auth/*", "/api/account/export"], ["user", "session", "account", "verification"], ["BETTER_AUTH_SECRET"], [], ["account.signed_up", "account.signed_in"]), navigation: [{ label: "Account", href: "/account", area: "main" }], schemaExports: ["./accounts-schema"], migrations: [{ tag: "0001_accounts", when: 1789824982408 }], suspension: "deny-routes", removal: "archive-required", docs: "Verified email/password accounts with recovery, profile and session controls.", dependencies: { "better-auth": "1.7.5" } })
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
