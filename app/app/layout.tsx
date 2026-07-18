import type { Metadata } from "next";
import { AppShell } from "@/components/os/AppShell";
import { requireUser } from "@/lib/os/auth";

export const metadata: Metadata = {
  title: { default: "Lymora OS", template: "%s · Lymora OS" },
  robots: { index: false, follow: false },
};

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AppShell user={user}>{children}</AppShell>;
}
