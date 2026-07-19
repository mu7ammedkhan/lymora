import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleGauge, Plus, ShieldCheck, TrendingUp, UserRoundSearch } from "lucide-react";
import { WorkforceTabs } from "@/components/os/WorkforceTabs";
import { requireRole } from "@/lib/os/auth";
import { formatAed } from "@/lib/os/corporate";
import { readDatabase } from "@/lib/os/store";
import { averageQuality, deploymentEconomics, operatorTypes, statusLabel } from "@/lib/os/workforce";

const operatingCycle = ["Recruit", "Train", "Certify", "Deploy", "Manage", "Improve"];

export default async function WorkforcePage() {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const activeDeployments = database.workforceDeployments.filter((item) => item.status === "active");
  const recurringRevenue = activeDeployments.reduce((sum, item) => sum + item.clientRateMonthlyAed, 0);
  const grossProfit = activeDeployments.reduce((sum, item) => sum + deploymentEconomics(item).grossProfit, 0);
  const grossMargin = recurringRevenue ? Math.round(grossProfit / recurringRevenue * 100) : 0;
  const availableOperators = database.workforceOperators.filter((item) => item.status === "available");
  const onboardingOperators = database.workforceOperators.filter((item) => ["applicant", "screening", "onboarding"].includes(item.status));
  const latestReviews = activeDeployments.map((deployment) => database.operatorQualityReviews.find((review) => review.deploymentId === deployment.id)).filter(Boolean);
  const qualityScore = latestReviews.length ? Math.round(latestReviews.reduce((sum, review) => sum + averageQuality(review!), 0) / latestReviews.length) : 0;
  const operatorById = new Map(database.workforceOperators.map((item) => [item.id, item]));
  const accountById = new Map(database.corporateAccounts.map((item) => [item.id, item]));

  return (
    <div className="os-page os-workforce-page">
      <div className="os-page-head"><div><span className="os-label">Managed AI workforce</span><h1>From talent to trusted delivery.</h1><p>Recruit, prepare and deploy AI operators through one controlled service with visible economics, client SOPs and continuous quality assurance.</p></div><div className="os-page-actions"><Link href="/app/workforce/operators/new" className="os-button os-button-secondary"><UserRoundSearch size={15} /> Add operator</Link><Link href="/app/workforce/deployments/new" className="os-button"><Plus size={15} /> New deployment</Link></div></div>
      <WorkforceTabs active="overview" />

      <div className="os-workforce-command">
        <div><span>Monthly recurring revenue</span><strong>{formatAed(recurringRevenue)}</strong><small>{activeDeployments.length} active subscription{activeDeployments.length === 1 ? "" : "s"}</small></div>
        <div><span>Gross margin</span><strong>{grossMargin}%</strong><small>{formatAed(grossProfit)} contribution</small></div>
        <div><span>Qualified bench</span><strong>{availableOperators.length}</strong><small>{onboardingOperators.length} in preparation</small></div>
        <div><span>Quality index</span><strong>{qualityScore || "-"}</strong><small>Latest managed-service reviews</small></div>
        <aside><BriefcaseBusiness size={20} /><span>Workforce pilot<strong>{activeDeployments.length} / 1 operator deployed</strong></span></aside>
      </div>

      <section className="os-workforce-cycle">
        <span className="os-label">AI Workforce Framework</span>
        <div>{operatingCycle.map((step, index) => <div className={index <= 3 ? "is-active" : ""} key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}</div>
      </section>

      <div className="os-workforce-grid">
        <section className="os-panel os-deployment-board">
          <div className="os-panel-head"><div><span className="os-label">Recurring delivery</span><h2>Active deployments</h2></div><TrendingUp size={19} /></div>
          <div className="os-deployment-list">
            {activeDeployments.map((deployment) => {
              const operator = operatorById.get(deployment.operatorId);
              const account = accountById.get(deployment.accountId);
              const review = database.operatorQualityReviews.find((item) => item.deploymentId === deployment.id);
              const economics = deploymentEconomics(deployment);
              return <Link href={`/app/workforce/deployments/${deployment.id}`} key={deployment.id}><div className="os-deployment-identity"><span>{deployment.deploymentNumber}</span><strong>{account?.companyName}</strong><small>{operator?.fullName} - {deployment.roleTitle}</small></div><div><span>MRR</span><strong>{formatAed(deployment.clientRateMonthlyAed)}</strong></div><div><span>Margin</span><strong>{economics.grossMargin}%</strong></div><div><span>Quality</span><strong>{review ? averageQuality(review) : "-"}</strong></div><ArrowRight size={16} /></Link>;
            })}
            {activeDeployments.length === 0 && <div className="os-quiet-empty">No active operator deployments yet.</div>}
          </div>
        </section>

        <aside className="os-panel os-workforce-assurance">
          <div className="os-panel-head"><div><span className="os-label">Service assurance</span><h2>Control signals</h2></div><ShieldCheck size={19} /></div>
          <div><span>Approved client SOPs</span><strong>{database.clientSops.filter((item) => item.status === "approved").length}</strong></div>
          <div><span>Material risk incidents</span><strong>{database.operatorQualityReviews.reduce((sum, item) => sum + item.riskIncidents, 0)}</strong></div>
          <div><span>Average utilisation</span><strong>{latestReviews.length ? Math.round(latestReviews.reduce((sum, item) => sum + item!.utilisationPercent, 0) / latestReviews.length) : 0}%</strong></div>
          <div><span>Reviews requiring coaching</span><strong>{database.operatorQualityReviews.filter((item) => item.outcome !== "on_track").length}</strong></div>
        </aside>
      </div>

      <section className="os-panel os-workforce-bench-preview">
        <div className="os-panel-head"><div><span className="os-label">Qualified operator database</span><h2>Deployment-ready talent</h2></div><Link href="/app/workforce/operators">View talent bench <ArrowRight size={14} /></Link></div>
        <div className="os-operator-preview-list">
          {database.workforceOperators.slice(0, 5).map((operator) => {
            const tasks = database.operatorOnboardingItems.filter((item) => item.operatorId === operator.id);
            const complete = tasks.filter((item) => ["complete", "waived"].includes(item.status)).length;
            return <Link href={`/app/workforce/operators/${operator.id}`} key={operator.id}><div><span className="os-operator-monogram">{operator.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{operator.fullName}</strong><small>{operatorTypes[operator.operatorType].label}</small></span></div><span className={`os-workforce-state is-${operator.status}`}>{statusLabel(operator.status)}</span><span><strong>{operator.readinessScore}</strong><small>readiness</small></span><span><strong>{complete}/{tasks.length}</strong><small>onboarding</small></span><ArrowRight size={15} /></Link>;
          })}
        </div>
      </section>

      <div className="os-workforce-principle"><CircleGauge size={22} /><div><span className="os-label">Management principle</span><strong>Performance and wellbeing move together.</strong><p>Every deployment pairs measurable client value with coaching, controlled workload, human oversight and a documented path for improvement.</p></div><span className="os-sample-note">Fictional workspace data</span></div>
    </div>
  );
}
