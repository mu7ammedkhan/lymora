import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, CircleGauge, Contact, FileText, UsersRound } from "lucide-react";
import { CorporateTabs } from "@/components/os/CorporateTabs";
import { CorporateWorkspaceHeader } from "@/components/os/CorporateWorkspaceHeader";
import { updateCorporateOpportunityAction } from "@/lib/os/actions";
import { corporatePackages, formatAed, opportunityStages } from "@/lib/os/corporate";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

const engagementPath = ["Diagnose", "Prioritise", "Enable", "Implement", "Deploy", "Manage"];

export default async function CorporateOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops"]);
  const { id } = await params;
  const database = await readDatabase();
  const opportunity = database.corporateOpportunities.find((item) => item.id === id);
  if (!opportunity) notFound();
  const account = database.corporateAccounts.find((item) => item.id === opportunity.accountId);
  if (!account) notFound();
  const diagnostic = database.readinessAssessments.find((item) => item.opportunityId === opportunity.id);
  const proposals = database.corporateProposals.filter((item) => item.opportunityId === opportunity.id);
  const workshops = database.corporateWorkshops.filter((item) => item.opportunityId === opportunity.id);
  const activeStep = opportunity.stage === "won" ? 3 : opportunity.stage === "proposal" || opportunity.stage === "proof" ? 2 : opportunity.stage === "diagnosis" ? 1 : 0;

  return (
    <div className="os-page os-corporate-workspace">
      <CorporateWorkspaceHeader account={account} opportunity={opportunity} />
      <CorporateTabs opportunityId={opportunity.id} active="overview" />
      <div className="os-engagement-path">{engagementPath.map((step, index) => <div className={index <= activeStep ? "is-active" : ""} key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}</div>
      <div className="os-corporate-facts"><div><span><strong>{formatAed(opportunity.valueAed)}</strong>Commercial value</span></div><div><UsersRound size={18} /><span><strong>{opportunity.participantCount}</strong>{corporatePackages[opportunity.package].label}</span></div><div><CalendarDays size={18} /><span><strong>{opportunity.expectedCloseDate ? formatDate(opportunity.expectedCloseDate) : "Not set"}</strong>Expected decision</span></div><div><Contact size={18} /><span><strong>{account.primaryContactName}</strong>{account.primaryContactTitle || "Primary contact"}</span></div></div>

      <div className="os-corporate-overview-grid">
        <section className="os-panel os-opportunity-control">
          <div className="os-panel-head"><div><span className="os-label">Commercial control</span><h2>Opportunity state</h2></div><CircleGauge size={20} /></div>
          <form action={updateCorporateOpportunityAction} className="os-form-grid">
            <input type="hidden" name="opportunityId" value={opportunity.id} />
            <label>Stage<select name="stage" defaultValue={opportunity.stage}>{opportunityStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select></label>
            <label>Probability<input type="number" name="probability" min="0" max="100" defaultValue={opportunity.probability} required /></label>
            <label>Package<select name="package" defaultValue={opportunity.package}>{Object.entries(corporatePackages).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label>
            <label>Participants<input type="number" name="participantCount" min="1" max="10000" defaultValue={opportunity.participantCount} required /></label>
            <label>Value excluding VAT<input type="number" name="valueAed" min="0" defaultValue={opportunity.valueAed} required /></label>
            <label>Expected close<input type="date" name="expectedCloseDate" defaultValue={opportunity.expectedCloseDate ?? ""} /></label>
            <label className="full">Next step<input name="nextStep" defaultValue={opportunity.nextStep} /></label>
            <label>Next-step due<input type="date" name="nextStepDueAt" defaultValue={opportunity.nextStepDueAt ?? ""} /></label>
            <label>Lost reason<input name="lostReason" defaultValue={opportunity.lostReason} placeholder="Required when closed lost" /></label>
            <div className="os-form-actions full"><button type="submit" className="os-button">Save opportunity</button></div>
          </form>
        </section>

        <aside className="os-corporate-signal-stack">
          <Link href={`/app/corporate/${opportunity.id}/diagnostic`} className="os-panel os-signal-panel"><div><span className="os-label">Readiness</span><strong>{diagnostic?.overallScore ?? 0}</strong><small>{diagnostic?.maturity ?? "Not assessed"}</small></div><ArrowRight size={17} /></Link>
          <Link href={`/app/corporate/${opportunity.id}/proposal`} className="os-panel os-signal-panel"><div><span className="os-label">Proposals</span><strong>{proposals.length}</strong><small>{proposals[0]?.status ?? "Build commercial scope"}</small></div><FileText size={17} /></Link>
          <Link href={`/app/corporate/${opportunity.id}/workshops`} className="os-panel os-signal-panel"><div><span className="os-label">Workshops</span><strong>{workshops.length}</strong><small>{workshops.filter((item) => item.status === "completed").length} completed</small></div><ArrowRight size={17} /></Link>
        </aside>
      </div>

      <section className="os-panel os-account-brief"><div className="os-panel-head"><div><span className="os-label">Account context</span><h2>{account.industry} - {account.employeeBand} employees</h2></div></div><div><p>{account.notes || "No account notes yet."}</p><dl><div><dt>Email</dt><dd><a href={`mailto:${account.primaryContactEmail}`}>{account.primaryContactEmail}</a></dd></div><div><dt>Phone</dt><dd>{account.primaryContactPhone || "Not provided"}</dd></div><div><dt>Source</dt><dd>{account.source}</dd></div><div><dt>Status</dt><dd>{account.status}</dd></div></dl></div></section>
    </div>
  );
}
