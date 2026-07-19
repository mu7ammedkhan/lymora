import Link from "next/link";
import { ArrowRight, Plus, SlidersHorizontal } from "lucide-react";
import { WorkforceTabs } from "@/components/os/WorkforceTabs";
import { requireRole } from "@/lib/os/auth";
import { formatAed } from "@/lib/os/corporate";
import { readDatabase } from "@/lib/os/store";
import { operatorTypes, statusLabel } from "@/lib/os/workforce";
import type { WorkforceOperatorStatus } from "@/lib/os/types";

const statusFilters: Array<{ id: WorkforceOperatorStatus | "all"; label: string }> = [
  { id: "all", label: "All" }, { id: "available", label: "Available" }, { id: "onboarding", label: "Onboarding" },
  { id: "matched", label: "Matched" }, { id: "deployed", label: "Deployed" },
];

export default async function WorkforceOperatorsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "all";
  const operators = database.workforceOperators.filter((operator) =>
    (!query || [operator.fullName, operator.email, operator.operatorNumber, operator.specialisation, operatorTypes[operator.operatorType].label].some((value) => value.toLowerCase().includes(query))) &&
    (status === "all" || operator.status === status)
  );

  return (
    <div className="os-page os-workforce-page">
      <div className="os-page-head"><div><span className="os-label">Talent supply</span><h1>Qualified operator bench</h1><p>Keep capability, availability, cost, onboarding evidence and client fit visible before any deployment decision.</p></div><Link href="/app/workforce/operators/new" className="os-button"><Plus size={15} /> Add operator</Link></div>
      <WorkforceTabs active="operators" />
      <div className="os-workforce-filterbar"><SlidersHorizontal size={15} />{statusFilters.map((item) => <Link href={item.id === "all" ? "/app/workforce/operators" : `/app/workforce/operators?status=${item.id}`} className={status === item.id ? "is-active" : ""} key={item.id}>{item.label}<span>{item.id === "all" ? database.workforceOperators.length : database.workforceOperators.filter((operator) => operator.status === item.id).length}</span></Link>)}</div>

      <section className="os-panel os-operator-register">
        <div className="os-panel-head"><div><span className="os-label">Operator database</span><h2>{operators.length} profile{operators.length === 1 ? "" : "s"}</h2></div><span className="os-sample-note">Fictional workspace data</span></div>
        <div className="os-table-wrap"><table className="os-table"><thead><tr><th>Operator</th><th>Specialisation</th><th>Status</th><th>Readiness</th><th>Monthly cost</th><th>Onboarding</th><th aria-label="Open" /></tr></thead><tbody>{operators.map((operator) => {
          const tasks = database.operatorOnboardingItems.filter((item) => item.operatorId === operator.id);
          const complete = tasks.filter((item) => ["complete", "waived"].includes(item.status)).length;
          return <tr key={operator.id}><td><Link href={`/app/workforce/operators/${operator.id}`} className="os-person"><span>{operator.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{operator.fullName}</strong><small>{operator.operatorNumber} - {operator.location}</small></div></Link></td><td><strong className="os-cell-primary">{operatorTypes[operator.operatorType].label}</strong><small>{operator.specialisation}</small></td><td><span className={`os-workforce-state is-${operator.status}`}>{statusLabel(operator.status)}</span></td><td><strong>{operator.readinessScore}</strong><small>out of 100</small></td><td><strong>{formatAed(operator.monthlyCostAed)}</strong><small>{operator.capacityHoursMonth}h capacity</small></td><td><strong>{complete}/{tasks.length}</strong><small>{tasks.length ? Math.round(complete / tasks.length * 100) : 0}% complete</small></td><td><Link href={`/app/workforce/operators/${operator.id}`} className="os-row-open" aria-label={`Open ${operator.fullName}`}><ArrowRight size={15} /></Link></td></tr>;
        })}</tbody></table></div>
        {operators.length === 0 && <div className="os-quiet-empty">No operators match this view.</div>}
      </section>
    </div>
  );
}
