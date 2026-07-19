import Link from "next/link";

const tabs = [
  { id: "overview", label: "Overview", suffix: "" },
  { id: "diagnostic", label: "Readiness diagnostic", suffix: "/diagnostic" },
  { id: "proposal", label: "Proposals", suffix: "/proposal" },
  { id: "workshops", label: "Workshops", suffix: "/workshops" },
] as const;

export function CorporateTabs({ opportunityId, active }: { opportunityId: string; active: (typeof tabs)[number]["id"] }) {
  return (
    <nav className="os-tabs" aria-label="Corporate opportunity workspace views">
      {tabs.map((tab) => <Link key={tab.id} href={`/app/corporate/${opportunityId}${tab.suffix}`} className={active === tab.id ? "is-active" : ""}>{tab.label}</Link>)}
    </nav>
  );
}
