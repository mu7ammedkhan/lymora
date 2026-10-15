"use client";

import { usePathname } from "next/navigation";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlatform = pathname === "/login" || pathname.startsWith("/app");

  if (isPlatform) {
    return <main className="os-root">{children}</main>;
  }

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
      <WhatsAppSupport />
    </>
  );
}
