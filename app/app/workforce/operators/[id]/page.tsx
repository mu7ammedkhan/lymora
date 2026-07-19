import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Check, CircleGauge, Link2, Plus, ShieldCheck } from "lucide-react";
import { OperatorWorkspaceHeader } from "@/components/os/OperatorWorkspaceHeader";
import { createWorkforceMatchAction, updateOperatorOnboardingItemAction, updateWorkforceMatchStatusAction, updateWorkforceOperatorAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { formatAed } from "@/lib/os/corporate";
import { readDatabase } from "@/lib/os/store";
import { operatorTypes, statusLabel } from "@/lib/os/workforce";

export default async function WorkforceOperatorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const { id } = await params;
  const database = await readDatabase();
  const operator = database.workforceOperators.find((item) => item.id === id);
  if (!operator) notFound();
  const tasks = database.operatorOnboardingItems.filter((item) => item.operatorId === operator.id).sort((a, b) => a.sortOrder - b.sortOrder);
  const complete = tasks.filter((item) => ["complete", "waived"].includes(item.status)).length;
  const matches = database.workforceMatches.filter((item) => item.operatorId === operator.id);
  const deployments = database.workforceDeployments.filter((item) => item.operatorId === operator.id);
  const accountById = new Map(database.corporateAccounts.map((item) => [item.id, item]));

  return (
    <div className="os-page os-workforce-page os-operator-workspace">
      <OperatorWorkspaceHeader operator={operator} />
      <div className="os-operator-facts">
        <div><span className="os-label">Readiness</span><strong>{operator.readinessScore}</strong><small>out of 100</small></div>
        <div><span className="os-label">Onboarding</span><strong>{tasks.length ? Math.round(complete / tasks.length * 100) : 0}%</strong><small>{complete} of {tasks.length} controls</small></div>
        <div><span className="os-label">Internal cost</span><strong>{formatAed(operator.monthlyCostAed)}</strong><small>{operator.capacityHoursMonth} hours monthly</small></div>
        <div><span className="os-label">Client matches</span><strong>{matches.length}</strong><small>{deployments.length} deployment{deployments.length === 1 ? "" : "s"}</small></div>
      </div>

      <div className="os-operator-control-grid">
        <section className="os-panel">
          <div className="os-panel-head"><div><span className="os-label">Deployment readiness</span><h2>Operator control</h2></div><CircleGauge size={19} /></div>
          <form action={updateWorkforceOperatorAction} className="os-form-grid">
            <input type="hidden" name="operatorId" value={operator.id} />
            <label>Status<select name="status" defaultValue={operator.status}>{["applicant","screening","onboarding","available","matched","deployed","paused","inactive"].map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></label>
            <label>Readiness score<input type="number" name="readinessScore" min="0" max="100" defaultValue={operator.readinessScore} required /></label>
            <label>Work mode<select name="workMode" defaultValue={operator.workMode}><option value="remote">Remote</option><option value="on_site">On site</option><option value="hybrid">Hybrid</option></select></label>
            <label>Available from<input type="date" name="availableFrom" defaultValue={operator.availableFrom ?? ""} /></label>
            <label>Monthly operator cost<input type="number" name="monthlyCostAed" min="0" defaultValue={operator.monthlyCostAed} required /></label>
            <label>Capacity hours<input type="number" name="capacityHoursMonth" min="1" max="744" defaultValue={operator.capacityHoursMonth} required /></label>
            <label className="full">Specialisation<input name="specialisation" defaultValue={operator.specialisation} required /></label>
            <div className="os-form-actions full"><button className="os-button" type="submit">Save readiness</button></div>
          </form>
        </section>
        <aside className="os-panel os-operator-evidence">
          <div className="os-panel-head"><div><span className="os-label">Capability evidence</span><h2>{operatorTypes[operator.operatorType].label}</h2></div><BadgeCheck size={19} /></div>
          <p>{operator.experienceSummary}</p>
          <div className="os-skill-list">{operator.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          <dl><div><dt>Background</dt><dd>{operator.backgroundCheckComplete ? "Complete" : "Pending"}</dd></div><div><dt>Data policy</dt><dd>{operator.dataPolicySignedAt ? "Signed" : "Pending"}</dd></div><div><dt>Operator access</dt><dd>{operator.profileId ? "Linked" : "Not linked"}</dd></div></dl>
        </aside>
      </div>

      <section className="os-panel os-onboarding-control">
        <div className="os-panel-head"><div><span className="os-label">Operator onboarding</span><h2>Seven deployment controls</h2></div><span>{complete}/{tasks.length} complete</span></div>
        <div className="os-onboarding-progress"><i style={{ width: `${tasks.length ? Math.round(complete / tasks.length * 100) : 0}%` }} /></div>
        <div className="os-onboarding-list">{tasks.map((task, index) => <form action={updateOperatorOnboardingItemAction} key={task.id}><input type="hidden" name="operatorId" value={operator.id} /><input type="hidden" name="itemId" value={task.id} /><span className={`os-onboarding-check is-${task.status}`}>{["complete","waived"].includes(task.status) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><div><strong>{task.label}</strong><small>{task.category}{task.dueDate ? ` - due ${task.dueDate}` : ""}</small></div><input name="notes" defaultValue={task.notes} placeholder="Evidence or note" /><select name="status" defaultValue={task.status}><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="complete">Complete</option><option value="waived">Waived</option></select><button className="os-table-action" type="submit">Update</button></form>)}</div>
      </section>

      <section className="os-panel os-match-control">
        <div className="os-panel-head"><div><span className="os-label">Client fit</span><h2>Matching decisions</h2></div><Link href={`/app/workforce/deployments/new?operatorId=${operator.id}`} className="os-button os-button-secondary">Build deployment <ArrowRight size={14} /></Link></div>
        <div className="os-match-list">{matches.map((match) => {
          const account = accountById.get(match.accountId);
          return <article key={match.id}><div><span>{match.matchScore}% fit</span><strong>{account?.companyName}</strong><small>{match.roleTitle} - {formatAed(match.proposedRateAed)} monthly</small></div><p>{match.rationale}</p><form action={updateWorkforceMatchStatusAction}><input type="hidden" name="operatorId" value={operator.id} /><input type="hidden" name="matchId" value={match.id} /><select name="status" defaultValue={match.status}>{["suggested","shortlisted","client_review","approved","rejected","withdrawn"].map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select><button className="os-table-action" type="submit">Update</button></form></article>;
        })}{matches.length === 0 && <div className="os-quiet-empty">No client matches recorded.</div>}</div>
      </section>

      <form action={createWorkforceMatchAction} className="os-panel os-compact-corporate-form">
        <input type="hidden" name="operatorId" value={operator.id} />
        <div className="os-panel-head"><div><span className="os-label">Evidence-led matching</span><h2>Create client match</h2></div><Plus size={18} /></div>
        <div className="os-form-grid">
          <label>Client account<select name="accountId" required>{database.corporateAccounts.map((account) => <option value={account.id} key={account.id}>{account.companyName}</option>)}</select></label>
          <label>Corporate opportunity<select name="opportunityId" defaultValue=""><option value="">No linked opportunity</option>{database.corporateOpportunities.map((opportunity) => <option value={opportunity.id} key={opportunity.id}>{accountById.get(opportunity.accountId)?.companyName} - {opportunity.title}</option>)}</select></label>
          <label>Role title<input name="roleTitle" defaultValue={operatorTypes[operator.operatorType].label} required /></label>
          <label>Match status<select name="status" defaultValue="shortlisted"><option value="suggested">Suggested</option><option value="shortlisted">Shortlisted</option><option value="client_review">Client review</option><option value="approved">Approved</option></select></label>
          <label>Match score<input type="number" name="matchScore" min="0" max="100" defaultValue="80" required /></label>
          <label>Proposed monthly rate<input type="number" name="proposedRateAed" min="0" defaultValue="9000" required /></label>
          <label className="full">Fit rationale<textarea name="rationale" rows={3} required /></label>
          <label className="full">Client requirements<textarea name="clientRequirements" rows={3} required /></label>
        </div>
        <div className="os-form-actions"><span className="os-form-assurance"><ShieldCheck size={14} /> Match on evidence, role fit and governed workflow requirements.</span><button className="os-button" type="submit"><Link2 size={14} /> Create match</button></div>
      </form>
    </div>
  );
}
