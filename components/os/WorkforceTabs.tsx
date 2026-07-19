import Link from "next/link";

export function WorkforceTabs({ active }: { active: "overview" | "operators" | "deployment" }) {
  const tabs = [
    { id: "overview", label: "Command centre", href: "/app/workforce" },
    { id: "operators", label: "Talent bench", href: "/app/workforce/operators" },
    { id: "deployment", label: "New deployment", href: "/app/workforce/deployments/new" },
  ] as const;
  return <nav className="os-tabs os-workforce-tabs" aria-label="Workforce navigation">{tabs.map((tab) => <Link key={tab.id} href={tab.href} className={active === tab.id ? "is-active" : ""}>{tab.label}</Link>)}</nav>;
}
