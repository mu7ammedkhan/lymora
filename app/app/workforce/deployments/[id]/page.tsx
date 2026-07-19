import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, BriefcaseBusiness, CalendarClock, Check, CircleGauge, Plus, ShieldCheck } from "lucide-react";
import { createClientSopAction, createOperatorQualityReviewAction, updateClientSopStatusAction, updateWorkforceDeploymentAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { formatAed } from "@/lib/os/corporate";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";
import { averageQuality, deploymentEconomics, statusLabel, workforcePlans } from "@/lib/os/workforce";

export default async function WorkforceDeploymentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const { id } = await params;
  const database = await readDatabase();
  const deployment = database.workforceDeployments.find((item) => item.id === id);
  if (!deployment) notFound();
  const operator = database.workforceOperators.find((item) => item.id === deployment.operatorId);
  const account = database.corporateAccounts.find((item) => item.id === deployment.accountId);
  if (!operator || !account) notFound();
  const sops = database.clientSops.filter((item) => item.deploymentId === deployment.id);
  const reviews = database.operatorQualityReviews.filter((item) => item.deploymentId === deployment.id).sort((a, b) => b.reviewDate.localeCompare(a.reviewDate));
  const latestReview = reviews[0];
  const economics = deploymentEconomics(deployment);
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  return (
    <div className="os-page os-workforce-page os-deployment-workspace">
      <Link href="/app/workforce" className="os-back-link"><ArrowLeft size={15} /> Workforce command centre</Link>
      <div className="os-record-head os-deployment-head">
        <div className="os-corporate-identity"><span><BriefcaseBusiness size={21} /></span><div><div className="os-record-title"><h1>{account.companyName}</h1><span className={`os-workforce-state is-${deployment.status}`}>{statusLabel(deployment.status)}</span></div><p>{deployment.deploymentNumber} - {operator.fullName} - {deployment.roleTitle}</p></div></div>
        <div className="os-corporate-contact"><span>{workforcePlans[deployment.plan].label}</span><span>Started {formatDate(deployment.startsOn)}</span></div>
      </div>

      <div className="os-deployment-metrics">
        <div><span>Monthly recurring revenue</span><strong>{formatAed(deployment.clientRateMonthlyAed)}</strong><small>Charged monthly in advance</small></div>
        <div><span>Gross profit</span><strong>{formatAed(economics.grossProfit)}</strong><small>{economics.grossMargin}% gross margin</small></div>
        <div><span>Utilisation</span><strong>{latestReview?.utilisationPercent ?? 0}%</strong><small>{latestReview?.hoursWorked ?? 0} hours recorded</small></div>
        <div><span>Quality index</span><strong>{latestReview ? averageQuality(latestReview) : "-"}</strong><small>{latestReview ? statusLabel(latestReview.outcome) : "Awaiting first review"}</small></div>
        <div><span>Risk incidents</span><strong>{reviews.reduce((sum, review) => sum + review.riskIncidents, 0)}</strong><small>Across {reviews.length} review{reviews.length === 1 ? "" : "s"}</small></div>
      </div>

      <div className="os-deployment-control-grid">
        <section className="os-panel">
          <div className="os-panel-head"><div><span className="os-label">Managed service control</span><h2>Deployment state</h2></div><CircleGauge size={19} /></div>
          <form action={updateWorkforceDeploymentAction} className="os-form-grid">
            <input type="hidden" name="deploymentId" value={deployment.id} />
            <label>Status<select name="status" defaultValue={deployment.status}>{["preparing","active","paused","completed","terminated"].map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></label>
            <label>Next review<input type="datetime-local" name="nextReviewAt" defaultValue={deployment.nextReviewAt?.slice(0, 16) ?? ""} /></label>
            <label className="full">Expected outcomes<textarea name="outcomes" rows={4} defaultValue={deployment.outcomes} /></label>
            <label className="full">Success measures<textarea name="successMeasures" rows={4} defaultValue={deployment.successMeasures} /></label>
            <div className="os-form-actions full"><button className="os-button" type="submit">Save deployment</button></div>
          </form>
        </section>
        <aside className="os-panel os-deployment-commercial">
          <div className="os-panel-head"><div><span className="os-label">Unit economics</span><h2>Monthly model</h2></div><ShieldCheck size={19} /></div>
          <dl><div><dt>Client fee</dt><dd>{formatAed(deployment.clientRateMonthlyAed)}</dd></div><div><dt>Operator cost</dt><dd>{formatAed(deployment.operatorCostMonthlyAed)}</dd></div><div><dt>Management</dt><dd>{formatAed(deployment.managementAllocationAed)}</dd></div><div><dt>Tools and overhead</dt><dd>{formatAed(deployment.toolsOverheadAed)}</dd></div><div><dt>Gross contribution</dt><dd>{formatAed(economics.grossProfit)}</dd></div></dl>
          <p>{deployment.minimumTermMonths}-month minimum term. Software, travel and major customisation remain outside the standard fee.</p>
        </aside>
      </div>

      <section className="os-panel os-sop-register">
        <div className="os-panel-head"><div><span className="os-label">Client operating system</span><h2>Controlled SOP library</h2></div><BookOpenCheck size={19} /></div>
        <div className="os-sop-list">{sops.map((sop) => <details key={sop.id} open={sops.length === 1}><summary><span className={`os-risk-pill is-${sop.riskLevel}`}>{sop.riskLevel}</span><div><strong>{sop.title}</strong><small>{sop.department} - version {sop.version}</small></div><span className={`os-workforce-state is-${sop.status}`}>{statusLabel(sop.status)}</span></summary><div className="os-sop-body"><div><span className="os-label">Purpose</span><p>{sop.purpose}</p><span className="os-label">Inputs</span><p>{sop.inputs}</p><span className="os-label">Procedure</span>{sop.procedure.split("\n").map((line) => <p key={line}>{line}</p>)}</div><aside><span className="os-label">Approved tools</span>{sop.approvedTools.map((tool) => <span key={tool}><Check size={12} />{tool}</span>)}<span className="os-label">Review criteria</span><p>{sop.reviewCriteria}</p><span className="os-label">Data controls</span><p>{sop.dataControls}</p><strong>Human approver: {sop.humanApprover}</strong></aside></div><form action={updateClientSopStatusAction}><input type="hidden" name="deploymentId" value={deployment.id} /><input type="hidden" name="sopId" value={sop.id} /><select name="status" defaultValue={sop.status}>{["draft","review","approved","retired"].map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select><button className="os-table-action" type="submit">Update status</button></form></details>)}</div>
      </section>

      <form action={createClientSopAction} className="os-panel os-compact-corporate-form">
        <input type="hidden" name="deploymentId" value={deployment.id} />
        <div className="os-panel-head"><div><span className="os-label">Version-controlled work</span><h2>Add client SOP</h2></div><Plus size={18} /></div>
        <div className="os-form-grid">
          <label>SOP title<input name="title" required /></label><label>Department<input name="department" required /></label>
          <label>Version<input type="number" name="version" min="1" defaultValue="1" required /></label><label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="review">Review</option><option value="approved">Approved</option></select></label>
          <label>Risk level<select name="riskLevel" defaultValue="amber"><option value="green">Green</option><option value="amber">Amber</option><option value="red">Red</option></select></label><label>Human approver<input name="humanApprover" required /></label>
          <label className="full">Purpose<textarea name="purpose" rows={3} required /></label>
          <label className="full">Approved tools, separated by commas<input name="approvedTools" /></label>
          <label className="full">Approved inputs<textarea name="inputs" rows={3} /></label>
          <label className="full">Procedure<textarea name="procedure" rows={7} placeholder="Use one numbered step per line." required /></label>
          <label className="full">Review criteria<textarea name="reviewCriteria" rows={4} required /></label>
          <label className="full">Data controls<textarea name="dataControls" rows={4} required /></label>
        </div>
        <div className="os-form-actions"><span className="os-form-assurance"><ShieldCheck size={14} /> Human verification remains mandatory for material decisions.</span><button className="os-button" type="submit">Create SOP</button></div>
      </form>

      <section className="os-panel os-quality-register">
        <div className="os-panel-head"><div><span className="os-label">Continuous assurance</span><h2>Quality reviews</h2></div><CalendarClock size={19} /></div>
        <div className="os-quality-list">{reviews.map((review) => <article key={review.id}><time>{formatDate(review.reviewDate, { day: "2-digit", month: "short" })}</time><div><span className={`os-quality-outcome is-${review.outcome}`}>{statusLabel(review.outcome)}</span><strong>{averageQuality(review)} quality index</strong><small>{review.periodStart} to {review.periodEnd}</small></div><div><span>Quality<strong>{review.qualityScore}</strong></span><span>Reliability<strong>{review.reliabilityScore}</strong></span><span>Responsible AI<strong>{review.responsibleAiScore}</strong></span><span>Client satisfaction<strong>{review.clientSatisfactionScore}</strong></span></div><p>{review.clientFeedback || "No client feedback recorded."}</p></article>)}</div>
      </section>

      <form action={createOperatorQualityReviewAction} className="os-panel os-compact-corporate-form">
        <input type="hidden" name="deploymentId" value={deployment.id} /><input type="hidden" name="operatorId" value={operator.id} />
        <div className="os-panel-head"><div><span className="os-label">Performance and wellbeing</span><h2>Record QA review</h2></div><Plus size={18} /></div>
        <div className="os-form-grid">
          <label>Review date<input type="date" name="reviewDate" defaultValue={today} required /></label><label>Outcome<select name="outcome" defaultValue="on_track"><option value="on_track">On track</option><option value="coaching">Coaching</option><option value="at_risk">At risk</option></select></label>
          <label>Period start<input type="date" name="periodStart" defaultValue={monthStart} required /></label><label>Period end<input type="date" name="periodEnd" defaultValue={today} required /></label>
          <label>Quality score<input type="number" name="qualityScore" min="0" max="100" defaultValue="85" required /></label><label>Reliability score<input type="number" name="reliabilityScore" min="0" max="100" defaultValue="85" required /></label>
          <label>Responsible-AI score<input type="number" name="responsibleAiScore" min="0" max="100" defaultValue="90" required /></label><label>Client satisfaction<input type="number" name="clientSatisfactionScore" min="0" max="100" defaultValue="85" required /></label>
          <label>Utilisation percent<input type="number" name="utilisationPercent" min="0" max="200" defaultValue="80" required /></label><label>Hours worked<input type="number" name="hoursWorked" min="0" step="0.25" defaultValue="0" required /></label>
          <label>Hours saved<input type="number" name="hoursSaved" min="0" step="0.25" defaultValue="0" required /></label><label>Risk incidents<input type="number" name="riskIncidents" min="0" defaultValue="0" required /></label>
          <label className="full">Client feedback<textarea name="clientFeedback" rows={3} /></label>
          <label>Strengths<textarea name="strengths" rows={4} /></label><label>Coaching and next actions<textarea name="actions" rows={4} /></label>
        </div>
        <div className="os-form-actions"><span className="os-form-assurance"><ShieldCheck size={14} /> Never trade operator wellbeing for utilisation.</span><button className="os-button" type="submit">Save QA review</button></div>
      </form>
    </div>
  );
}
