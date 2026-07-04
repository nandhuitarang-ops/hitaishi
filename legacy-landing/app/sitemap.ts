import type { MetadataRoute } from "next";

const ROUTES = [
  "",
  "/students",
  "/mentors",
  "/institutions",
  "/pricing",
  "/become-a-mentor",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hitaishi.in";
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
