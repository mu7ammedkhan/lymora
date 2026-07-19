import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { WorkforceTabs } from "@/components/os/WorkforceTabs";
import { createWorkforceDeploymentAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { operatorTypes, workforcePlans } from "@/lib/os/workforce";

export default async function NewWorkforceDeploymentPage({ searchParams }: { searchParams: Promise<{ operatorId?: string }> }) {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const preferredOperatorId = (await searchParams).operatorId;
  const operators = database.workforceOperators.filter((item) => !["inactive", "applicant", "screening"].includes(item.status));
  const selectedOperator = operators.find((item) => item.id === preferredOperatorId) ?? operators[0];
  const accountById = new Map(database.corporateAccounts.map((item) => [item.id, item]));
  const inThirtyDays = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 16);

  return (
    <div className="os-page os-form-page os-workforce-intake">
      <Link href="/app/workforce" className="os-back-link"><ArrowLeft size={15} /> Workforce command centre</Link>
      <div className="os-page-head"><div><span className="os-label">Managed workforce subscription</span><h1>Design a deployment</h1><p>Translate an approved operator match into clear economics, role ownership, measurable outcomes and a review rhythm.</p></div></div>
      <WorkforceTabs active="deployment" />
      <div className="os-deployment-standard"><ShieldCheck size={25} /><div><strong>Price managed productivity, not cheap labour.</strong><p>The monthly fee includes recruitment, training, supervision, quality assurance, continuous development and replacement risk.</p></div></div>
      <form action={createWorkforceDeploymentAction} className="os-panel os-record-form">
        <div className="os-form-section"><span>01</span><div><h2>Operator and client</h2><p>Deploy only after role fit and required onboarding controls are evidenced.</p></div></div>
        <div className="os-form-grid">
          <label>Operator<select name="operatorId" defaultValue={selectedOperator?.id} required>{operators.map((operator) => <option value={operator.id} key={operator.id}>{operator.fullName} - {operatorTypes[operator.operatorType].label} - {operator.status}</option>)}</select></label>
          <label>Approved match<select name="matchId" defaultValue=""><option value="">No linked match</option>{database.workforceMatches.filter((match) => !database.workforceDeployments.some((deployment) => deployment.matchId === match.id)).map((match) => <option value={match.id} key={match.id}>{database.workforceOperators.find((operator) => operator.id === match.operatorId)?.fullName} - {accountById.get(match.accountId)?.companyName}</option>)}</select></label>
          <label>Client account<select name="accountId" required>{database.corporateAccounts.map((account) => <option value={account.id} key={account.id}>{account.companyName}</option>)}</select></label>
          <label>Corporate opportunity<select name="opportunityId" defaultValue=""><option value="">No linked opportunity</option>{database.corporateOpportunities.map((opportunity) => <option value={opportunity.id} key={opportunity.id}>{accountById.get(opportunity.accountId)?.companyName} - {opportunity.title}</option>)}</select></label>
          <label>Role title<input name="roleTitle" defaultValue={selectedOperator ? operatorTypes[selectedOperator.operatorType].label : "AI Operations Operator"} required /></label>
          <label>Subscription plan<select name="plan" defaultValue="starter">{Object.entries(workforcePlans).map(([id, plan]) => <option value={id} key={id}>{plan.label} - {plan.capacity}</option>)}</select></label>
        </div>
        <div className="os-form-section"><span>02</span><div><h2>Term and economics</h2><p>Subscriptions are charged monthly in advance with a minimum contract term.</p></div></div>
        <div className="os-form-grid">
          <label>Status<select name="status" defaultValue="preparing"><option value="preparing">Preparing</option><option value="active">Active</option></select></label>
          <label>Starts on<input type="date" name="startsOn" defaultValue={new Date().toISOString().slice(0, 10)} required /></label>
          <label>Ends on<input type="date" name="endsOn" /></label>
          <label>Minimum term months<input type="number" name="minimumTermMonths" min="1" max="36" defaultValue="3" required /></label>
          <label>Client monthly rate<input type="number" name="clientRateMonthlyAed" min="0" defaultValue="9000" required /></label>
          <label>Operator monthly cost<input type="number" name="operatorCostMonthlyAed" min="0" defaultValue={selectedOperator?.monthlyCostAed ?? 5000} required /></label>
          <label>Training and management allocation<input type="number" name="managementAllocationAed" min="0" defaultValue="1000" required /></label>
          <label>Tools and overhead<input type="number" name="toolsOverheadAed" min="0" defaultValue="500" required /></label>
          <label>Target hours per month<input type="number" name="targetHoursMonth" min="1" max="744" defaultValue={selectedOperator?.capacityHoursMonth ?? 160} required /></label>
          <label>Next performance review<input type="datetime-local" name="nextReviewAt" defaultValue={inThirtyDays} /></label>
        </div>
        <div className="os-form-section"><span>03</span><div><h2>Ownership and outcomes</h2><p>State what changes in the work and how the client will know the pilot is working.</p></div></div>
        <div className="os-form-grid">
          <label>Client owner name<input name="clientOwnerName" required /></label><label>Client owner email<input type="email" name="clientOwnerEmail" required /></label>
          <label className="full">Expected outcomes<textarea name="outcomes" rows={4} required /></label>
          <label className="full">Success measures<textarea name="successMeasures" rows={4} placeholder="Baseline, time saved, quality, cost, adoption and risk." required /></label>
        </div>
        <div className="os-form-actions"><Link href="/app/workforce" className="os-button os-button-secondary">Cancel</Link><button type="submit" className="os-button">Create deployment <ArrowRight size={15} /></button></div>
      </form>
    </div>
  );
}
