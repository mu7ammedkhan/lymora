import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Funnel_Display, Geist, Geist_Mono, Instrument_Serif, Inter, Lora } from "next/font/google";
import "./globals.css";
import "./caio.css";
import "./os.css";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteFrame } from "@/components/SiteFrame";

const GA_ID = "G-THLL6VB225";

// Public site type system
const display = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

// Lymora OS (/app) keeps its own type; not preloaded on the public site
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  preload: false,
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

export const viewport: Viewport = { themeColor: "#08080D" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} ${mono.variable} ${serif.variable} ${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
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
