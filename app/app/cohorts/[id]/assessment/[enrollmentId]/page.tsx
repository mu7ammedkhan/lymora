import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, CheckCircle2, ExternalLink, FileWarning, ShieldCheck } from "lucide-react";
import { CohortTabs } from "@/components/os/CohortTabs";
import { gradeAssessmentAction, issueCredentialAction } from "@/lib/os/actions";
import { getAssessmentSummary, getAttendanceRate } from "@/lib/os/academy";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate, initials } from "@/lib/os/utils";

export default async function LearnerAssessmentPage({ params }: { params: Promise<{ id: string; enrollmentId: string }> }) {
  const user = await requireRole(["super_admin", "academy_ops", "assessor"]);
  const { id, enrollmentId } = await params;
  const database = await readDatabase();
  const cohort = database.cohorts.find((item) => item.id === id);
  const enrollment = database.enrollments.find((item) => item.id === enrollmentId && item.cohortId === id);
  const application = database.applications.find((item) => item.id === enrollment?.applicationId);
  if (!cohort || !enrollment || !application) notFound();
  const summary = getAssessmentSummary(database, enrollment.id);
  const attendance = getAttendanceRate(database, enrollment.id, cohort.id);
  const credential = database.credentials.find((item) => item.enrollmentId === enrollment.id);
  const canIssue = user.role !== "assessor";

  return (
    <div className="os-page os-academy-page">
      <Link href={`/app/cohorts/${cohort.id}/assessment`} className="os-back-link"><ArrowLeft size={15} /> Cohort gradebook</Link>
      <div className="os-record-head os-learner-assessment-head">
        <div className="os-record-person"><span>{initials(application.fullName)}</span><div><span className="os-label">{application.number}</span><h1>{application.fullName}</h1><p>{application.currentRole} · {application.track}</p></div></div>
        <div className="os-certification-score"><span>Weighted score</span><strong>{summary.overallScore.toFixed(1)}%</strong><small>{summary.completedWeight}% assessed</small></div>
      </div>
      <CohortTabs cohortId={cohort.id} active="assessment" />

      <div className="os-assessment-readiness">
        <div className={summary.overallScore >= 75 ? "is-ready" : ""}><CheckCircle2 size={17} /><span>Overall standard<strong>{summary.overallScore >= 75 ? "Met" : "75% required"}</strong></span></div>
        <div className={summary.responsibleAiPassed ? "is-ready" : ""}><ShieldCheck size={17} /><span>Responsible-AI gate<strong>{summary.responsibleAiPassed ? "Passed" : "Pending"}</strong></span></div>
        <div className={attendance.rate >= 80 ? "is-ready" : ""}><CheckCircle2 size={17} /><span>Recorded attendance<strong>{attendance.recorded ? `${attendance.rate}%` : "Not started"}</strong></span></div>
        <div className={summary.certificationReady ? "is-ready" : ""}><Award size={17} /><span>Certification decision<strong>{credential?.status ?? (summary.certificationReady ? "Eligible" : "Not ready")}</strong></span></div>
      </div>

      <div className="os-assessment-layout">
        <section className="os-assessment-stack">
          {summary.items.map(({ component, submission, result, meetsThreshold }) => <article className="os-panel os-assessment-item" key={component.id}>
            <div className="os-assessment-item-head"><div><span>{component.code.replaceAll("_", " ")} · {component.weight}%</span><h2>{component.title}</h2><p>{component.description}</p></div><span className={`os-state-pill is-${meetsThreshold ? "passed" : submission?.status ?? "not-started"}`}>{meetsThreshold ? "standard met" : submission?.status?.replaceAll("_", " ") ?? "not started"}</span></div>
            <div className="os-evidence-brief">
              <div><span>Evidence</span>{submission?.evidenceUrl ? <a href={submission.evidenceUrl} target="_blank" rel="noreferrer">Open submission <ExternalLink size={13} /></a> : <strong>No evidence link</strong>}</div>
              <div><span>Learner note</span><p>{submission?.submissionNotes || "No submission note has been provided."}</p></div>
              <div><span>Threshold</span><strong>{component.passThreshold}%{component.responsibleAiGate ? " · mandatory" : ""}</strong></div>
            </div>
            <form action={gradeAssessmentAction} className="os-grade-form">
              <input type="hidden" name="cohortId" value={cohort.id} /><input type="hidden" name="enrollmentId" value={enrollment.id} /><input type="hidden" name="componentId" value={component.id} />
              <label>Score<input name="score" type="number" min="0" max="100" step="0.1" defaultValue={result?.score ?? ""} required /></label>
              <label>Outcome<select name="outcome" defaultValue={result?.outcome ?? "pass"}><option value="pass">Pass</option><option value="resubmit">Resubmit</option><option value="fail">Fail</option></select></label>
              <label className="os-grade-feedback">Assessor feedback<textarea name="feedback" defaultValue={result?.feedback ?? ""} minLength={5} required placeholder="Record evidence-based feedback and any required revision." /></label>
              <button type="submit" className="os-button">Save assessment</button>
            </form>
          </article>)}
        </section>

        <aside className="os-assessment-side">
          <section className="os-panel os-decision-panel">
            <Award size={22} />
            <span className="os-label">Credential decision</span>
            {credential ? <><h2>{credential.credentialNumber}</h2><p>Issued {credential.issuedAt ? formatDate(credential.issuedAt) : "pending"}. Valid until {credential.expiresAt ? formatDate(credential.expiresAt) : "not set"}.</p><span className={`os-state-pill is-${credential.status}`}>{credential.status}</span></> : summary.certificationReady ? <><h2>Ready to certify.</h2><p>Every component threshold, overall score and responsible-AI gate has been met.</p>{canIssue && <form action={issueCredentialAction}><input type="hidden" name="cohortId" value={cohort.id} /><input type="hidden" name="enrollmentId" value={enrollment.id} /><button type="submit" className="os-button"><Award size={14} /> Issue credential</button></form>}</> : <><h2>Evidence incomplete.</h2><p>Certification remains locked until all five assessment standards are passed.</p><div className="os-decision-lock"><FileWarning size={15} /> {summary.completedWeight}% of weighted evidence graded</div></>}
          </section>
          <section className="os-panel os-score-breakdown">
            <span className="os-label">Score contribution</span>
            {summary.items.map(({ component, result }) => <div key={component.id}><span>{component.title}</span><strong>{result ? `${result.score}%` : "-"}</strong><progress max="100" value={result?.score ?? 0} /></div>)}
          </section>
        </aside>
      </div>
    </div>
  );
}
