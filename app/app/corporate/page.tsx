import Link from "next/link";
import { ArrowRight, CalendarClock, Plus, Target, TrendingUp } from "lucide-react";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatAed, opportunityStages } from "@/lib/os/corporate";
import { formatDate } from "@/lib/os/utils";

export default async function CorporatePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireRole(["super_admin", "academy_ops"]);
  const database = await readDatabase();
  const query = ((await searchParams).q ?? "").trim().toLowerCase();
  const accountById = new Map(database.corporateAccounts.map((account) => [account.id, account]));
  const opportunities = database.corporateOpportunities.filter((opportunity) => {
    const account = accountById.get(opportunity.accountId);
    return !query || [account?.companyName, account?.industry, opportunity.title, opportunity.stage].some((value) => value?.toLowerCase().includes(query));
  });
  const open = opportunities.filter((item) => !["won", "lost"].includes(item.stage));
  const pipelineValue = open.reduce((sum, item) => sum + item.valueAed, 0);
  const weightedValue = open.reduce((sum, item) => sum + item.valueAed * item.probability / 100, 0);
  const sentProposals = database.corporateProposals.filter((item) => ["sent", "accepted", "declined"].includes(item.status));
  const acceptedProposals = sentProposals.filter((item) => item.status === "accepted");
  const conversion = sentProposals.length ? Math.round(acceptedProposals.length / sentProposals.length * 100) : 0;
  const averageContract = acceptedProposals.length ? acceptedProposals.reduce((sum, item) => sum + item.subtotalAed, 0) / acceptedProposals.length : 0;
  const upcoming = database.corporateWorkshops.filter((item) => new Date(item.startsAt) >= new Date() && item.status !== "cancelled").slice(0, 4);

  return (
    <div className="os-page os-corporate-page">
      <div className="os-page-head"><div><span className="os-label">Team AI enablement</span><h1>Corporate growth</h1><p>Diagnose organisational readiness, convert the right work and carry every engagement into implementation.</p></div><Link href="/app/corporate/new" className="os-button"><Plus size={16} /> New opportunity</Link></div>
      <div className="os-corporate-command">
        <div><span>Open pipeline</span><strong>{formatAed(pipelineValue)}</strong><small>{open.length} qualified conversations</small></div>
        <div><span>Weighted value</span><strong>{formatAed(weightedValue)}</strong><small>Stage-adjusted forecast</small></div>
        <div><span>Proposal conversion</span><strong>{conversion}%</strong><small>{acceptedProposals.length} accepted of {sentProposals.length} decided</small></div>
        <div><span>Average contract</span><strong>{formatAed(averageContract)}</strong><small>Accepted enablement work</small></div>
        <aside><Target size={19} /><span>90-day objective<strong>{Math.min(acceptedProposals.length, 2)} / 2 corporate pilots</strong></span></aside>
      </div>

      <section className="os-corporate-pipeline">
        <div className="os-section-heading"><div><span className="os-label">Revenue movement</span><h2>Active pipeline</h2></div><span className="os-sample-note">Fictional workspace data</span></div>
        <div className="os-pipeline-board">
          {opportunityStages.filter((stage) => !["won", "lost"].includes(stage.id)).map((stage) => {
            const stageItems = opportunities.filter((item) => item.stage === stage.id);
            return <div className="os-pipeline-column" key={stage.id}><header><span>{stage.label}</span><strong>{stageItems.length}</strong></header><div>{stageItems.map((opportunity) => { const account = accountById.get(opportunity.accountId); return <Link href={`/app/corporate/${opportunity.id}`} key={opportunity.id}><span className="os-pipeline-company">{account?.companyName}</span><strong>{opportunity.title}</strong><small>{formatAed(opportunity.valueAed)} - {opportunity.probability}%</small><footer><span>{opportunity.nextStep || "Define next move"}</span><ArrowRight size={13} /></footer></Link>; })}{stageItems.length === 0 && <span className="os-pipeline-empty">No active work</span>}</div></div>;
          })}
        </div>
      </section>

      <div className="os-corporate-lower">
        <section className="os-panel os-corporate-table-panel"><div className="os-panel-head"><div><span className="os-label">Opportunity register</span><h2>Commercial detail</h2></div><TrendingUp size={19} /></div><div className="os-table-wrap"><table className="os-table"><thead><tr><th>Account</th><th>Industry</th><th>Stage</th><th>Value</th><th>Next move</th></tr></thead><tbody>{opportunities.map((opportunity) => { const account = accountById.get(opportunity.accountId); return <tr key={opportunity.id}><td><Link href={`/app/corporate/${opportunity.id}`}><strong className="os-cell-primary">{account?.companyName}</strong><small>{opportunity.title}</small></Link></td><td>{account?.industry}</td><td><span className={`os-stage-pill is-${opportunity.stage}`}>{opportunity.stage}</span></td><td><strong>{formatAed(opportunity.valueAed)}</strong><small>{opportunity.probability}% weighted</small></td><td>{opportunity.nextStep}<small>{opportunity.nextStepDueAt ? formatDate(opportunity.nextStepDueAt, { day: "numeric", month: "short" }) : "No date"}</small></td></tr>; })}</tbody></table></div></section>
        <aside className="os-panel os-upcoming-workshops"><div className="os-panel-head"><div><span className="os-label">Delivery horizon</span><h2>Upcoming</h2></div><CalendarClock size={19} /></div>{upcoming.map((workshop) => { const opportunity = database.corporateOpportunities.find((item) => item.id === workshop.opportunityId); const account = opportunity && accountById.get(opportunity.accountId); return <Link href={`/app/corporate/${workshop.opportunityId}/workshops`} key={workshop.id}><time><strong>{formatDate(workshop.startsAt, { day: "2-digit" })}</strong><span>{formatDate(workshop.startsAt, { month: "short" })}</span></time><div><strong>{workshop.title}</strong><small>{account?.companyName} - {workshop.status}</small></div><ArrowRight size={14} /></Link>; })}{upcoming.length === 0 && <div className="os-quiet-empty">No upcoming workshops scheduled.</div>}</aside>
      </div>
    </div>
  );
}
