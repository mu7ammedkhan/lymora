import Link from "next/link";

const tabs = [
  { id: "overview", label: "Overview", suffix: "" },
  { id: "delivery", label: "Delivery", suffix: "/delivery" },
  { id: "assessment", label: "Assessment", suffix: "/assessment" },
] as const;

export function CohortTabs({ cohortId, active }: { cohortId: string; active: (typeof tabs)[number]["id"] }) {
  return (
    <nav className="os-tabs" aria-label="Cohort workspace views">
      {tabs.map((tab) => <Link key={tab.id} href={`/app/cohorts/${cohortId}${tab.suffix}`} className={active === tab.id ? "is-active" : ""}>{tab.label}</Link>)}
    </nav>
  );
}
