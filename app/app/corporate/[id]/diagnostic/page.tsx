import { notFound } from "next/navigation";
import { Plus, ShieldCheck } from "lucide-react";
import { CorporateTabs } from "@/components/os/CorporateTabs";
import { CorporateWorkspaceHeader } from "@/components/os/CorporateWorkspaceHeader";
import { ReadinessForm } from "@/components/os/ReadinessForm";
import { addWorkflowOpportunityAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";

export default async function CorporateDiagnosticPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops"]);
  const { id } = await params;
  const database = await readDatabase();
  const opportunity = database.corporateOpportunities.find((item) => item.id === id);
  const account = opportunity && database.corporateAccounts.find((item) => item.id === opportunity.accountId);
  const assessment = database.readinessAssessments.find((item) => item.opportunityId === id);
  if (!opportunity || !account || !assessment) notFound();
  const workflows = database.workflowOpportunities.filter((item) => item.readinessAssessmentId === assessment.id).sort((a, b) => a.priority - b.priority);
  return (
    <div className="os-page os-corporate-workspace">
      <CorporateWorkspaceHeader account={account} opportunity={opportunity} />
      <CorporateTabs opportunityId={opportunity.id} active="diagnostic" />
      <div className="os-diagnostic-intro"><div><span className="os-label">Lymora AI Readiness Score</span><h2>Turn scattered AI use into an implementation path.</h2><p>Assess leadership, people, process, data, tools, governance and adoption. Then prioritise workflows by value, feasibility and responsible-AI risk.</p></div><ShieldCheck size={32} /></div>
      <ReadinessForm assessment={assessment} />

      <section className="os-panel os-workflow-register">
        <div className="os-panel-head"><div><span className="os-label">Value realisation</span><h2>Priority workflow register</h2></div><span>{workflows.length} use cases</span></div>
        <div className="os-table-wrap"><table className="os-table"><thead><tr><th>Priority</th><th>Workflow</th><th>Value</th><th>Feasibility</th><th>Risk</th><th>Human oversight</th></tr></thead><tbody>{workflows.map((workflow) => <tr key={workflow.id}><td><strong className="os-priority-number">{String(workflow.priority).padStart(2, "0")}</strong></td><td><strong className="os-cell-primary">{workflow.workflowName}</strong><small>{workflow.department} - {workflow.frequency}</small></td><td><strong>{workflow.valueScore}</strong><small>out of 100</small></td><td><strong>{workflow.feasibilityScore}</strong><small>out of 100</small></td><td><span className={`os-risk-pill is-${workflow.riskLevel}`}>{workflow.riskLevel}</span></td><td>{workflow.humanOversight}<small>{workflow.recommendation}</small></td></tr>)}</tbody></table></div>
      </section>

      <form action={addWorkflowOpportunityAction} className="os-panel os-compact-corporate-form">
        <input type="hidden" name="opportunityId" value={opportunity.id} /><input type="hidden" name="assessmentId" value={assessment.id} />
        <div className="os-panel-head"><div><span className="os-label">Workflow audit</span><h2>Add a use case</h2></div><Plus size={18} /></div>
        <div className="os-form-grid">
          <label>Workflow name<input name="workflowName" required /></label><label>Department<input name="department" required /></label>
          <label>Current pain<input name="currentPain" /></label><label>Frequency<input name="frequency" placeholder="Daily, weekly, 50 per month" /></label>
          <label>Value score<input type="number" name="valueScore" min="0" max="100" defaultValue="70" required /></label><label>Feasibility score<input type="number" name="feasibilityScore" min="0" max="100" defaultValue="70" required /></label>
          <label>Risk classification<select name="riskLevel" defaultValue="amber"><option value="green">Green - low sensitivity</option><option value="amber">Amber - controlled use</option><option value="red">Red - restricted</option></select></label><label>Priority<input type="number" name="priority" min="1" max="100" defaultValue={workflows.length + 1} required /></label>
          <label>Human oversight<input name="humanOversight" placeholder="Who reviews what before release?" /></label><label>Recommendation<input name="recommendation" /></label>
        </div>
        <div className="os-form-actions"><button type="submit" className="os-button"><Plus size={15} /> Add workflow</button></div>
      </form>
    </div>
  );
}
