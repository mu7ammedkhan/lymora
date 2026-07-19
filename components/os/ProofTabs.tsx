import Link from "next/link";

const tabs = [
  { id: "overview", label: "Overview", href: "/app/proof" },
  { id: "reports", label: "Outcome reports", href: "/app/proof/reports" },
  { id: "specialisations", label: "Role specialisations", href: "/app/proof/specialisations" },
  { id: "partnerships", label: "Partnerships", href: "/app/proof/partnerships" },
] as const;

export function ProofTabs({ active }: { active: (typeof tabs)[number]["id"] }) {
  return <nav className="os-tabs os-proof-tabs" aria-label="Proof and expansion navigation">{tabs.map((tab) => <Link key={tab.id} href={tab.href} className={active === tab.id ? "is-active" : ""}>{tab.label}</Link>)}</nav>;
}
