"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlatform = pathname === "/login" || pathname.startsWith("/app");

  if (isPlatform) {
    return <main className="os-root">{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppSupport />
    </>
  );
}
