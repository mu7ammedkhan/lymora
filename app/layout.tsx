import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import "./os.css";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteFrame } from "@/components/SiteFrame";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Lymora | AI Workforce Company", template: "%s | Lymora" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "technology",
  keywords: ["AI workforce", "AI training Dubai", "AI certification", "team AI enablement", "AI workforce solutions UAE", "responsible AI training"],
  alternates: { canonical: siteConfig.url },
  openGraph: { title: "Lymora | AI Workforce Company", description: siteConfig.description, url: siteConfig.url, siteName: siteConfig.name, locale: "en_AE", type: "website", images: [{ url: "/og.png", width: 1730, height: 909, alt: "Lymora - Human Meets Intelligence" }] },
  twitter: { card: "summary_large_image", title: "Lymora | AI Workforce Company", description: siteConfig.description, images: ["/og.png"] },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${lora.variable}`}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <MotionProvider />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
