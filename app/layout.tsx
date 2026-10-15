import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./caio.css";
import "./os.css";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteFrame } from "@/components/SiteFrame";

const GA_ID = "G-THLL6VB225";

// One typeface across the whole site, Lymora OS included
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-js','')" }} />
      </head>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <MotionProvider />
        <SiteFrame>{children}</SiteFrame>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
