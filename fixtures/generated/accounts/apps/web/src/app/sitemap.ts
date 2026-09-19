import type { MetadataRoute } from "next";
import routes from "../../routes.json";
const origin = process.env.APP_URL ?? "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(path => ({ url: new URL(path, origin).toString(), changeFrequency: "monthly" }));
}
