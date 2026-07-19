import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { createOutcomeReportAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { proofEngagementLabels } from "@/lib/os/proof";
import { readDatabase } from "@/lib/os/store";

export default async function NewOutcomeReportPage() {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const today = new Date().toISOString().slice(0, 10);
  return <div className="os-page os-proof-page os-proof-form-page">
    <Link href="/app/proof/reports" className="os-back-link"><ArrowLeft size={15} /> Outcome reports</Link>
    <div className="os-page-head"><div><span className="os-label">Evidence capture</span><h1>Create an outcome report</h1><p>Anchor every claim to a delivery record, a defined baseline and named evidence.</p></div></div>
    <form action={createOutcomeReportAction} className="os-panel os-proof-form">
      <div className="os-form-section"><span>01</span><div><h2>Engagement record</h2><p>Connect the report to the work that produced the result.</p></div></div>
      <div className="os-form-grid">
        <label className="full">Report title<input name="title" placeholder="Team enablement - 30-day outcome review" required /></label>
        <label>Engagement type<select name="engagementType" defaultValue="team_enablement">{Object.entries(proofEngagementLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label>Initial status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="review">In review</option><option value="approved">Approved</option></select></label>
        <label>Corporate account<select name="accountId" defaultValue=""><option value="">Not applicable</option>{database.corporateAccounts.map((item) => <option value={item.id} key={item.id}>{item.companyName}</option>)}</select></label>
        <label>Opportunity<select name="opportunityId" defaultValue=""><option value="">Not applicable</option>{database.corporateOpportunities.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label>
        <label>Workforce deployment<select name="deploymentId" defaultValue=""><option value="">Not applicable</option>{database.workforceDeployments.map((item) => <option value={item.id} key={item.id}>{item.deploymentNumber} - {item.roleTitle}</option>)}</select></label>
        <label>Academy cohort<select name="cohortId" defaultValue=""><option value="">Not applicable</option>{database.cohorts.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <label>Period start<input type="date" name="periodStart" defaultValue={today} required /></label><label>Period end<input type="date" name="periodEnd" defaultValue={today} required /></label>
      </div>
      <div className="os-form-section"><span>02</span><div><h2>Outcome narrative</h2><p>Separate baseline, observed result and next recommendation.</p></div></div>
      <div className="os-form-grid"><label className="full">Executive summary<textarea name="executiveSummary" rows={4} /></label><label className="full">Baseline<textarea name="baselineSummary" rows={4} /></label><label className="full">Observed outcomes<textarea name="outcomesSummary" rows={4} /></label><label className="full">Recommendations and expansion hypothesis<textarea name="recommendations" rows={4} /></label></div>
      <label className="os-check-line"><input type="checkbox" name="clientApproved" /> <span><strong>Client has approved this outcome record</strong><small>Required before publication. Written evidence should be retained outside this record.</small></span></label>
      <div className="os-form-actions"><span className="os-form-assurance"><ShieldCheck size={14} /> Claims remain internal until evidence and consent are approved.</span><button className="os-button" type="submit">Create report</button></div>
    </form>
  </div>;
}
