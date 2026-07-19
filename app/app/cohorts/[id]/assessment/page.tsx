import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Award, ClipboardCheck, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { CohortTabs } from "@/components/os/CohortTabs";
import { getAssessmentSummary } from "@/lib/os/academy";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { initials } from "@/lib/os/utils";

export default async function CohortAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops", "assessor"]);
  const { id } = await params;
  const database = await readDatabase();
  const cohort = database.cohorts.find((item) => item.id === id);
  if (!cohort) notFound();
  const components = [...database.assessmentComponents].filter((item) => item.programCode === "CAIO").sort((a, b) => a.sortOrder - b.sortOrder);
  const learners = database.enrollments.filter((item) => item.cohortId === cohort.id).map((enrollment) => ({
    enrollment,
    application: database.applications.find((item) => item.id === enrollment.applicationId),
    summary: getAssessmentSummary(database, enrollment.id),
    credential: database.credentials.find((item) => item.enrollmentId === enrollment.id),
  })).filter((item) => item.application);
  const submitted = database.assessmentSubmissions.filter((item) => learners.some((learner) => learner.enrollment.id === item.enrollmentId) && item.status === "submitted").length;
  const graded = database.assessmentResults.filter((result) => database.assessmentSubmissions.some((submission) => submission.id === result.submissionId && learners.some((learner) => learner.enrollment.id === submission.enrollmentId))).length;
  const ready = learners.filter((item) => item.summary.certificationReady).length;

  return (
    <div className="os-page os-academy-page">
      <Link href={`/app/cohorts/${cohort.id}`} className="os-back-link"><ArrowLeft size={15} /> {cohort.code}</Link>
      <div className="os-page-head"><div><span className="os-label">Assessment control</span><h1>Evidence before credential.</h1><p>Moderate the five weighted components and protect the CAIO professional standard.</p></div></div>
      <CohortTabs cohortId={cohort.id} active="assessment" />

      <div className="os-academy-metrics">
        <div><UsersRound size={17} /><span>Learners<strong>{learners.length} enrolled</strong></span></div>
        <div><ClipboardCheck size={17} /><span>Evidence queue<strong>{submitted} submitted</strong></span></div>
        <div><Scale size={17} /><span>Assessment records<strong>{graded}/{learners.length * components.length} graded</strong></span></div>
        <div><Award size={17} /><span>Credential ready<strong>{ready} learners</strong></span></div>
      </div>

      <section className="os-panel os-standard-panel">
        <div className="os-panel-head"><div><span className="os-label">CAIO assessment standard</span><h2>Five components · 100% weighted</h2></div><div className="os-standard-rule"><ShieldCheck size={16} /> 75% overall + every threshold</div></div>
        <div className="os-component-strip">{components.map((component) => <div key={component.id} className={component.responsibleAiGate ? "is-gate" : ""}><span>{component.code.replaceAll("_", " ")}</span><strong>{component.weight}%</strong><small>Minimum {component.passThreshold}%{component.responsibleAiGate ? " · mandatory gate" : ""}</small></div>)}</div>
      </section>

      <section className="os-panel os-gradebook-panel">
        <div className="os-panel-head"><div><span className="os-label">Cohort gradebook</span><h2>Learner certification readiness</h2></div></div>
        <div className="os-table-wrap"><table className="os-table os-gradebook"><thead><tr><th>Learner</th><th>Evidence</th><th>Weighted score</th><th>Responsible AI</th><th>Credential</th><th aria-label="Open" /></tr></thead><tbody>{learners.map(({ enrollment, application, summary, credential }) => application && <tr key={enrollment.id}>
          <td><Link href={`/app/cohorts/${cohort.id}/assessment/${enrollment.id}`} className="os-person"><span>{initials(application.fullName)}</span><div><strong>{application.fullName}</strong><small>{application.track}</small></div></Link></td>
          <td><strong>{summary.completedWeight}%</strong><small> weighted evidence</small></td>
          <td><span className={`os-grade-score ${summary.overallScore >= 75 ? "is-pass" : ""}`}>{summary.overallScore.toFixed(1)}%</span></td>
          <td><span className={`os-state-pill is-${summary.responsibleAiPassed ? "passed" : "pending"}`}>{summary.responsibleAiPassed ? "passed" : "pending"}</span></td>
          <td><span className={`os-state-pill is-${credential?.status ?? (summary.certificationReady ? "eligible" : "not-ready")}`}>{credential?.status ?? (summary.certificationReady ? "eligible" : "not ready")}</span></td>
          <td><Link href={`/app/cohorts/${cohort.id}/assessment/${enrollment.id}`} className="os-row-open" aria-label={`Assess ${application.fullName}`}><ArrowRight size={15} /></Link></td>
        </tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
