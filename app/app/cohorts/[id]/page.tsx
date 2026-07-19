import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Plus, UserRoundCheck, UsersRound } from "lucide-react";
import { enrolApplicationAction, updateCohortStatusAction } from "@/lib/os/actions";
import { StatusBadge } from "@/components/os/StatusBadge";
import { CohortTabs } from "@/components/os/CohortTabs";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate, initials } from "@/lib/os/utils";

export default async function CohortWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["super_admin", "academy_ops", "assessor"]);
  const { id } = await params;
  const database = await readDatabase();
  const cohort = database.cohorts.find((item) => item.id === id);
  if (!cohort) notFound();
  const enrollments = database.enrollments.filter((item) => item.cohortId === cohort.id);
  const learners = enrollments.map((enrollment) => ({ enrollment, application: database.applications.find((item) => item.id === enrollment.applicationId) })).filter((item) => item.application);
  const accepted = database.applications.filter((application) => application.status === "accepted" && !database.enrollments.some((enrollment) => enrollment.applicationId === application.id));
  const canManage = user.role !== "assessor";

  return (
    <div className="os-page os-cohort-workspace">
      <Link href="/app/cohorts" className="os-back-link"><ArrowLeft size={15} /> Cohorts</Link>
      <div className="os-record-head os-cohort-head"><div><div className="os-record-title"><h1>{cohort.name}</h1><StatusBadge status={cohort.status} /></div><p>{cohort.program} · {cohort.code}</p></div>{canManage && <form action={updateCohortStatusAction}><input type="hidden" name="cohortId" value={cohort.id} /><select name="status" defaultValue={cohort.status}>{["draft", "enrolling", "active", "completed"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select><button type="submit" className="os-button os-button-secondary">Update status</button></form>}</div>
      <CohortTabs cohortId={cohort.id} active="overview" />

      <div className="os-cohort-facts"><div><CalendarDays size={18} /><span>Programme dates<strong>{formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}</strong></span></div><div><Clock3 size={18} /><span>Delivery schedule<strong>{cohort.schedule}</strong></span></div><div><UsersRound size={18} /><span>Capacity<strong>{enrollments.length} enrolled · {cohort.capacity - enrollments.length} available</strong></span></div></div>

      <div className="os-dashboard-grid os-cohort-body">
        <section className="os-panel os-table-panel">
          <div className="os-panel-head"><div><span className="os-label">Learner roster</span><h2>{learners.length} participants</h2></div></div>
          <div className="os-table-wrap"><table className="os-table"><thead><tr><th>Participant</th><th>Track</th><th>Enrolment</th><th>Readiness</th></tr></thead><tbody>{learners.map(({ application, enrollment }) => application && <tr key={enrollment.id}><td><Link href={`/app/admissions/${application.id}`} className="os-person"><span>{initials(application.fullName)}</span><div><strong>{application.fullName}</strong><small>{application.email}</small></div></Link></td><td>{application.track}</td><td><StatusBadge status={enrollment.status === "invited" ? "invited" : "enrolled"} /></td><td><div className="os-inline-progress"><progress max="100" value={enrollment.progress} /><strong>{enrollment.progress}%</strong></div></td></tr>)}</tbody></table>{learners.length === 0 && <div className="os-empty"><UsersRound size={22} /><strong>No learners enrolled yet.</strong></div>}</div>
        </section>

        <aside className="os-panel os-enrol-panel">
          <div className="os-panel-head"><div><span className="os-label">Accepted applicants</span><h2>Add to cohort</h2></div><UserRoundCheck size={19} /></div>
          <p>Invite an accepted candidate to secure their place in this cohort.</p>
          {canManage ? accepted.length > 0 ? <form action={enrolApplicationAction}><input type="hidden" name="cohortId" value={cohort.id} /><label>Candidate<select name="applicationId" defaultValue="" required><option value="" disabled>Select accepted candidate</option>{accepted.map((application) => <option value={application.id} key={application.id}>{application.fullName} · {application.track}</option>)}</select></label><button type="submit" className="os-button"><Plus size={15} /> Send cohort invitation</button></form> : <div className="os-quiet-empty">All accepted candidates are already assigned.</div> : <div className="os-quiet-empty">Roster changes are managed by Academy Operations.</div>}
        </aside>
      </div>
    </div>
  );
}
