import type { MetadataRoute } from "next";
import { aiSolutions, industries, insights, operatorRoles, siteConfig } from "@/lib/site";

const siteUpdated = new Date("2026-07-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, frequency: "weekly" as const },
    { path: "/ai-workforce", priority: .95, frequency: "monthly" as const },
    { path: "/ai-solutions", priority: .95, frequency: "monthly" as const },
    { path: "/academy", priority: .9, frequency: "monthly" as const },
    { path: "/caio", priority: .98, frequency: "weekly" as const },
    { path: "/academy/team-ai-enablement", priority: .9, frequency: "monthly" as const },
    { path: "/for-businesses", priority: .85, frequency: "monthly" as const },
    { path: "/for-professionals", priority: .8, frequency: "monthly" as const },
    { path: "/enterprise", priority: .9, frequency: "monthly" as const },
    { path: "/enterprise/ai-readiness-assessment", priority: .9, frequency: "monthly" as const },
    { path: "/enterprise/ai-transformation", priority: .85, frequency: "monthly" as const },
    { path: "/methodologies", priority: .8, frequency: "monthly" as const },
    { path: "/about", priority: .7, frequency: "monthly" as const },
    { path: "/insights", priority: .8, frequency: "weekly" as const },
    { path: "/contact", priority: .7, frequency: "monthly" as const },
    { path: "/privacy", priority: .3, frequency: "yearly" as const },
    { path: "/terms", priority: .3, frequency: "yearly" as const }
  ];

  return [
    ...routes.map(route => ({ url: `${siteConfig.url}${route.path}`, lastModified: siteUpdated, changeFrequency: route.frequency, priority: route.priority })),
    ...aiSolutions.map(item => ({ url: `${siteConfig.url}/ai-solutions/${item.slug}`, lastModified: siteUpdated, changeFrequency: "monthly" as const, priority: .88 })),
    ...operatorRoles.map(item => ({ url: `${siteConfig.url}/ai-workforce/${item.slug}`, lastModified: siteUpdated, changeFrequency: "monthly" as const, priority: .82 })),
    ...industries.map(item => ({ url: `${siteConfig.url}/industries/${item.slug}`, lastModified: siteUpdated, changeFrequency: "monthly" as const, priority: .78 })),
    ...insights.map(item => ({ url: `${siteConfig.url}/insights/${item.slug}`, lastModified: new Date(item.date), changeFrequency: "monthly" as const, priority: .75 }))
  ];
}
