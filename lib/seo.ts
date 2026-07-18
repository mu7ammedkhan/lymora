import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function pageMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  keywords = []
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_AE",
      images: [{ url: "/og.png", width: 1730, height: 909, alt: "Lymora - Human Meets Intelligence" }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"]
    },
    robots: noIndex ? { index: false, follow: false } : undefined
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    logo: `${siteConfig.url}/icon.svg`,
    image: `${siteConfig.url}/og.png`,
    areaServed: [
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Place", name: "Gulf Cooperation Council" }
    ],
    knowsAbout: ["AI workforce development", "Corporate AI training", "AI workflow design", "Responsible AI governance", "AI readiness assessment", "Managed AI operations"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and customer enquiries",
      email: siteConfig.email,
      availableLanguage: "English",
      areaServed: "AE"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE"
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    subOrganization: [
      { "@type": "EducationalOrganization", name: "Lymora Academy", url: `${siteConfig.url}/academy` },
      { "@type": "Organization", name: "Lymora Workforce", url: `${siteConfig.url}/ai-workforce` },
      { "@type": "Organization", name: "Lymora Enterprise", url: `${siteConfig.url}/enterprise` }
    ]
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-AE",
    publisher: { "@id": `${siteConfig.url}/#organization` }
  };
}

export function courseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Lymora Certified AI Operator™ — CAIO™",
    description:
      "A five-week professional certification in applied AI, workflow design and responsible automation.",
    url: `${siteConfig.url}/caio`,
    provider: { "@type": "EducationalOrganization", name: "Lymora Academy", url: `${siteConfig.url}/academy` },
    educationalCredentialAwarded: "Lymora Certified AI Operator™",
    timeRequired: "PT36H",
    inLanguage: "en",
    offers: { "@type": "Offer", category: "Founding cohort professional certification", price: "2250", priceCurrency: "AED", url: `${siteConfig.url}/caio`, availability: "https://schema.org/LimitedAvailability" },
    teaches: [
      "Applied artificial intelligence",
      "AI workflow design",
      "Responsible AI",
      "No-code automation",
      "Business productivity"
    ]
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`
    }))
  };
}

export function serviceSchema(service: { name: string; description: string; path: string; audience?: string; offers?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}${service.path}#service`,
    name: service.name,
    description: service.description,
    url: `${siteConfig.url}${service.path}`,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    audience: service.audience ? { "@type": "Audience", audienceType: service.audience } : undefined,
    hasOfferCatalog: service.offers?.length ? {
      "@type": "OfferCatalog",
      name: `${service.name} deliverables`,
      itemListElement: service.offers.map(name => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }))
    } : undefined
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
}

export function articleSchema(article: { title: string; description: string; path: string; datePublished: string; dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${siteConfig.url}${article.path}`,
    mainEntityOfPage: `${siteConfig.url}${article.path}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    inLanguage: "en-AE",
    image: `${siteConfig.url}/og.png`,
    author: { "@id": `${siteConfig.url}/#organization` },
    publisher: { "@id": `${siteConfig.url}/#organization` }
  };
}
