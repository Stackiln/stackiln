import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  const publicSite = process.env.APP_ENV === "production";
  return {
    rules: {
      userAgent: "*",
      allow: publicSite ? "/" : undefined,
      disallow: publicSite ? undefined : "/",
    },
    sitemap: publicSite
      ? new URL("/sitemap.xml", process.env.APP_URL).toString()
      : undefined,
  };
}
