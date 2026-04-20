import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agrodash.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/products",
    "/orders",
    "/customers",
    "/invoices",
    "/calendar",
    "/kanban",
    "/analytics",
    "/settings",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
  ];

  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
