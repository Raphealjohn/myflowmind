import type { MetadataRoute } from "next";
import { COMPANIES } from "@/lib/content";
import { getArticles } from "@/lib/insights";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const articles = await getArticles();

  return [
    { url: base, priority: 1 },
    { url: `${base}/companies`, priority: 0.9 },
    ...COMPANIES.map((c) => ({
      url: `${base}/companies/${c.slug}`,
      priority: 0.9,
    })),
    { url: `${base}/about`, priority: 0.7 },
    { url: `${base}/insights`, priority: 0.7 },
    ...articles.map((a) => ({
      url: `${base}/insights/${a.slug}`,
      lastModified: a.publishedAt,
      priority: 0.6,
    })),
    { url: `${base}/contact`, priority: 0.8 },
    { url: `${base}/legal/privacy`, priority: 0.2 },
    { url: `${base}/legal/terms`, priority: 0.2 },
  ];
}
