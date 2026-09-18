import type { MetadataRoute } from "next";

const SITE_URL = "https://narihito-portfolio.vercel.app";
const ROUTES = ["", "/about", "/skills", "/experience", "/projects", "/events", "/games", "/testimonials", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
