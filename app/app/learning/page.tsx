import { redirect } from "next/navigation";
import { Award, CalendarDays, Check, CheckCircle2, Clock3, ExternalLink, FileUp, LockKeyhole, ShieldCheck, Video } from "lucide-react";
import { submitAssessmentEvidenceAction } from "@/lib/os/actions";
import { effectiveModuleStatus, getAssessmentSummary, getAttendanceRate } from "@/lib/os/academy";
import { requireUser } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

export default async function LearningPage() {
  const user = await requireUser();
  if (user.role !== "candidate") redirect("/app");
  const database = await readDatabase();
  const enrollment = database.enrollments.find((item) => item.applicationId === user.applicationId);
  const cohort = database.cohorts.find((item) => item.id === enrollment?.cohortId);
  if (!enrollment || !cohort) return <NoProgramme />;
  const modules = database.cohortModules.filter((item) => item.cohortId === cohort.id).map((cohortModule) => ({
    cohortModule,
    module: database.learningModules.find((item) => item.id === cohortModule.moduleId),
  })).filter((item) => item.module).sort((a, b) => (a.module?.sortOrder ?? 0) - (b.module?.sortOrder ?? 0));
  const sessions = database.cohortSessions.filter((item) => item.cohortId === cohort.id && item.status !== "cancelled").sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const nextSession = sessions.find((item) => new Date(item.startsAt) > new Date());
  const attendance = getAttendanceRate(database, enrollment.id, cohort.id);
  const assessment = getAssessmentSummary(database, enrollment.id);
  const credential = database.credentials.find((item) => item.enrollmentId === enrollment.id);
  const openModules = modules.filter(({ cohortModule }) => effectiveModuleStatus(cohortModule.status, cohortModule.opensAt) !== "locked").length;
  const canSubmit = enrollment.status === "enrolled" || enrollment.status === "active";

  return (
    <div className="os-page os-candidate-learning">
      <div className="os-page-head"><div><span className="os-label">{cohort.code} · CAIO learning pathway</span><h1>Build the evidence.</h1><p>Five applied weeks leading to a verified professional credential.</p></div><div className="os-candidate-cohort-state"><span>{enrollment.status}</span><strong>{enrollment.progress}% ready</strong></div></div>

      <section className="os-learning-command">
        <div><span className="os-label">Next live session</span>{nextSession ? <><h2>{nextSession.title}</h2><p><CalendarDays size={15} /> {formatDate(nextSession.startsAt, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}</p><p><Video size={15} /> {nextSession.deliveryMode.replaceAll("_", " ")}</p>{nextSession.joinUrl ? <a className="os-button" href={nextSession.joinUrl} target="_blank" rel="noreferrer">Join live session <ExternalLink size={14} /></a> : <button className="os-button" type="button" disabled>Access link pending</button>}</> : <><h2>Programme complete.</h2><p>No future live session is scheduled.</p></>}</div>
        <div className="os-learning-progress"><strong>{assessment.overallScore.toFixed(1)}%</strong><span>Weighted assessment score</span><progress max="100" value={assessment.overallScore} /><small>{assessment.completedWeight}% of evidence graded</small></div>
      </section>

      <div className="os-learning-metrics">
        <div><Clock3 size={17} /><span>Pathway access<strong>{openModules}/{modules.length} modules open</strong></span></div>
        <div><Video size={17} /><span>Live schedule<strong>{sessions.length} sessions</strong></span></div>
        <div><CheckCircle2 size={17} /><span>Attendance<strong>{attendance.recorded ? `${attendance.rate}% recorded` : "Not started"}</strong></span></div>
        <div><ShieldCheck size={17} /><span>Responsible AI<strong>{assessment.responsibleAiPassed ? "Gate passed" : "Mandatory gate"}</strong></span></div>
      </div>

      <section className="os-learning-section">
        <div className="os-section-heading"><div><span className="os-label">Programme pathway</span><h2>Five weeks, built around the work.</h2></div><p>Each week combines live sessions, guided practice and assessed evidence.</p></div>
        <div className="os-learning-list">{modules.map(({ cohortModule, module }) => module && (() => {
          const state = effectiveModuleStatus(cohortModule.status, cohortModule.opensAt);
          const moduleSessions = sessions.filter((item) => item.moduleId === module.id);
          return <article key={cohortModule.id} className={state !== "locked" ? "is-ready" : ""}>
            <span className="os-module-number">{String(module.weekNumber).padStart(2, "0")}</span>
            <div><span>{module.competencyDomain}</span><h2>{module.title}</h2><p>{module.summary}</p><small>{moduleSessions.length} live sessions · {module.liveHours} live hours · Due {formatDate(cohortModule.dueAt, { day: "numeric", month: "short" })}</small></div>
            <div className="os-module-state">{state === "completed" ? <><Check size={17} /> Complete</> : state === "open" ? <><CheckCircle2 size={17} /> Open</> : <><LockKeyhole size={17} /> Opens {formatDate(cohortModule.opensAt, { day: "numeric", month: "short" })}</>}</div>
          </article>;
        })())}</div>
      </section>

      <section className="os-learning-section os-candidate-assessments">
        <div className="os-section-heading"><div><span className="os-label">Certification evidence</span><h2>Attendance is not certification.</h2></div><p>Submit applied work for independent assessment against the CAIO standard.</p></div>
        <div className="os-candidate-assessment-list">{assessment.items.map(({ component, submission, result, meetsThreshold }) => <article key={component.id} className={meetsThreshold ? "is-complete" : ""}>
          <div className="os-assessment-title"><span>{component.weight}%</span><div><small>{component.code.replaceAll("_", " ")}</small><h3>{component.title}</h3><p>{component.description}</p></div><span className={`os-state-pill is-${meetsThreshold ? "passed" : submission?.status ?? "not-started"}`}>{meetsThreshold ? "passed" : submission?.status?.replaceAll("_", " ") ?? "not started"}</span></div>
          {result && <div className="os-assessor-response"><strong>{result.score}% · {result.outcome}</strong><p>{result.feedback}</p></div>}
          {!meetsThreshold && <form action={submitAssessmentEvidenceAction} className="os-evidence-form">
            <input type="hidden" name="componentId" value={component.id} />
            <label>Evidence link<input name="evidenceUrl" type="url" defaultValue={submission?.evidenceUrl ?? ""} placeholder="https://docs.google.com/..." required disabled={!canSubmit} /></label>
            <label>Submission note<textarea name="submissionNotes" defaultValue={submission?.submissionNotes ?? ""} minLength={10} placeholder="Describe what the evidence demonstrates and the controls applied." required disabled={!canSubmit} /></label>
            <button type="submit" className="os-button" disabled={!canSubmit}><FileUp size={14} /> {submission ? "Resubmit evidence" : "Submit evidence"}</button>
          </form>}
        </article>)}</div>
      </section>

      <section className={`os-credential-banner ${credential ? "is-issued" : ""}`}>
        <Award size={25} />
        <div><span className="os-label">Professional credential</span><h2>{credential ? credential.credentialNumber : assessment.certificationReady ? "Certification ready" : "Locked until every standard is met"}</h2><p>{credential ? `Issued ${credential.issuedAt ? formatDate(credential.issuedAt) : ""} and valid until ${credential.expiresAt ? formatDate(credential.expiresAt) : "renewal"}.` : "CAIO requires 75% overall, every component threshold, mandatory responsible-AI competence and a successful professional review."}</p></div>
        <span className={`os-state-pill is-${credential?.status ?? (assessment.certificationReady ? "eligible" : "locked")}`}>{credential?.status ?? (assessment.certificationReady ? "eligible" : "locked")}</span>
      </section>
    </div>
  );
}

function NoProgramme() {
  return <div className="os-page"><div className="os-page-head"><div><span className="os-label">Candidate workspace</span><h1>Your learning pathway is being prepared.</h1><p>Academy Operations will publish your cohort schedule after enrolment is confirmed.</p></div></div><div className="os-panel os-empty"><Clock3 size={23} /><strong>No active programme yet.</strong></div></div>;
}
