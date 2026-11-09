import { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return ["", ...projects.map(({ slug }) => `/projects/${slug}`)].map((path) => ({ url: `${base}${path}`, lastModified: new Date("2026-10-14"), changeFrequency: "monthly", priority: path ? 0.7 : 1 }));
}
