import type { MetadataRoute } from "next";
const origin = process.env.APP_URL ?? "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/features", "/contact", "/privacy", "/terms"].map(path => ({ url: new URL(path, origin).toString(), changeFrequency: "monthly" }));
}
