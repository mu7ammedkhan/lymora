import { BookOpenCheck, BriefcaseBusiness, Check, CircleGauge, Clock3, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";
import { averageQuality, operatorTypes, statusLabel } from "@/lib/os/workforce";

export default async function OperatorWorkspacePage() {
  const user = await requireRole(["operator"]);
  const database = await readDatabase();
  const operator = database.workforceOperators.find((item) => item.profileId === user.id);
  if (!operator) return <div className="os-page os-operator-portal"><div className="os-page-head"><div><span className="os-label">Lymora Workforce</span><h1>Your operator profile is being prepared.</h1><p>Talent Operations will link your onboarding and deployment record to this account before work begins.</p></div></div><div className="os-panel os-empty"><ShieldCheck size={24} /><strong>No client data is available yet.</strong><span>Your access will appear here after identity and role verification.</span></div></div>;

  const tasks = database.operatorOnboardingItems.filter((item) => item.operatorId === operator.id).sort((a, b) => a.sortOrder - b.sortOrder);
  const deployment = database.workforceDeployments.find((item) => item.operatorId === operator.id && ["preparing", "active", "paused"].includes(item.status));
  const account = deployment && database.corporateAccounts.find((item) => item.id === deployment.accountId);
  const sops = deployment ? database.clientSops.filter((item) => item.deploymentId === deployment.id && item.status === "approved") : [];
  const reviews = deployment ? database.operatorQualityReviews.filter((item) => item.deploymentId === deployment.id).sort((a, b) => b.reviewDate.localeCompare(a.reviewDate)) : [];
  const latestReview = reviews[0];
  const complete = tasks.filter((item) => ["complete", "waived"].includes(item.status)).length;

  return (
    <div className="os-page os-operator-portal">
      <div className="os-page-head"><div><span className="os-label">{operator.operatorNumber}</span><h1>Good morning, {operator.fullName.split(" ")[0]}.</h1><p>Your approved work, controls and coaching record are gathered here. Client data remains inside the agreed workspace and SOP boundaries.</p></div><span className={`os-workforce-state is-${operator.status}`}>{statusLabel(operator.status)}</span></div>
      <div className="os-operator-portal-command">
        <div><BriefcaseBusiness size={20} /><span>Current role<strong>{operatorTypes[operator.operatorType].label}</strong></span></div>
        <div><CircleGauge size={20} /><span>Readiness<strong>{operator.readinessScore} / 100</strong></span></div>
        <div><Check size={20} /><span>Onboarding<strong>{complete} / {tasks.length} controls</strong></span></div>
        <div><ShieldCheck size={20} /><span>Quality index<strong>{latestReview ? averageQuality(latestReview) : "Awaiting review"}</strong></span></div>
      </div>

      {deployment ? <>
        <section className="os-operator-assignment">
          <div><span className="os-label">Current assignment</span><h2>{account?.companyName}</h2><p>{deployment.roleTitle}</p></div>
          <div><span>Starts</span><strong>{formatDate(deployment.startsOn)}</strong></div><div><span>Next review</span><strong>{deployment.nextReviewAt ? formatDate(deployment.nextReviewAt) : "To be scheduled"}</strong></div><div><span>Status</span><strong>{statusLabel(deployment.status)}</strong></div>
        </section>
        <div className="os-operator-portal-grid">
          <section className="os-panel">
            <div className="os-panel-head"><div><span className="os-label">Outcome brief</span><h2>What success means</h2></div><CircleGauge size={19} /></div>
            <p>{deployment.outcomes}</p><div className="os-operator-success"><span className="os-label">Measures</span><p>{deployment.successMeasures}</p></div>
          </section>
          <aside className="os-panel">
            <div className="os-panel-head"><div><span className="os-label">Work rhythm</span><h2>Operating controls</h2></div><Clock3 size={19} /></div>
            <div className="os-operator-control-list"><span><Check size={13} />Use only approved client tools</span><span><Check size={13} />Verify material claims against sources</span><span><Check size={13} />Route decisions to the human owner</span><span><Check size={13} />Record exceptions and improvements</span></div>
          </aside>
        </div>
      </> : <div className="os-panel os-empty"><BriefcaseBusiness size={24} /><strong>No active deployment.</strong><span>Talent Operations will publish your assignment here after client approval.</span></div>}

      <section className="os-panel os-operator-sop-portal">
        <div className="os-panel-head"><div><span className="os-label">Approved work only</span><h2>Client SOPs</h2></div><BookOpenCheck size={19} /></div>
        {sops.map((sop) => <details key={sop.id}><summary><span className={`os-risk-pill is-${sop.riskLevel}`}>{sop.riskLevel}</span><div><strong>{sop.title}</strong><small>{sop.department} - version {sop.version}</small></div></summary><div className="os-sop-body"><div><span className="os-label">Purpose</span><p>{sop.purpose}</p><span className="os-label">Procedure</span>{sop.procedure.split("\n").map((line) => <p key={line}>{line}</p>)}</div><aside><span className="os-label">Review criteria</span><p>{sop.reviewCriteria}</p><span className="os-label">Data controls</span><p>{sop.dataControls}</p><strong>Human approver: {sop.humanApprover}</strong></aside></div></details>)}
        {sops.length === 0 && <div className="os-quiet-empty">Approved client SOPs will appear here.</div>}
      </section>

      <section className="os-panel os-operator-onboarding-portal">
        <div className="os-panel-head"><div><span className="os-label">Deployment readiness</span><h2>Onboarding record</h2></div><span>{complete}/{tasks.length}</span></div>
        <div>{tasks.map((task) => <span key={task.id} className={`is-${task.status}`}><i>{["complete", "waived"].includes(task.status) ? <Check size={12} /> : null}</i><strong>{task.label}</strong><small>{statusLabel(task.status)}</small></span>)}</div>
      </section>
    </div>
  );
}
