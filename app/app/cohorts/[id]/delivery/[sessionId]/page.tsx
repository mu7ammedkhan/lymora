import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, UsersRound } from "lucide-react";
import { CohortTabs } from "@/components/os/CohortTabs";
import { markAttendanceAction, updateSessionStatusAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate, initials } from "@/lib/os/utils";

export default async function SessionAttendancePage({ params }: { params: Promise<{ id: string; sessionId: string }> }) {
  const user = await requireRole(["super_admin", "academy_ops", "assessor"]);
  const { id, sessionId } = await params;
  const database = await readDatabase();
  const cohort = database.cohorts.find((item) => item.id === id);
  const session = database.cohortSessions.find((item) => item.id === sessionId && item.cohortId === id);
  if (!cohort || !session) notFound();
  const module = database.learningModules.find((item) => item.id === session.moduleId);
  const canManage = user.role !== "assessor";
  const duration = Math.round((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / 60_000);
  const learners = database.enrollments.filter((item) => item.cohortId === cohort.id).map((enrollment) => ({
    enrollment,
    application: database.applications.find((item) => item.id === enrollment.applicationId),
    attendance: database.attendanceRecords.find((item) => item.sessionId === session.id && item.enrollmentId === enrollment.id),
  })).filter((item) => item.application);
  const attended = learners.filter((item) => item.attendance && ["present", "late"].includes(item.attendance.status)).length;

  return (
    <div className="os-page os-academy-page">
      <Link href={`/app/cohorts/${cohort.id}/delivery`} className="os-back-link"><ArrowLeft size={15} /> Delivery schedule</Link>
      <div className="os-record-head os-session-head">
        <div><span className="os-label">{module?.code ?? cohort.code}</span><h1>{session.title}</h1><p>{formatDate(session.startsAt, { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })}</p></div>
        {canManage && <form action={updateSessionStatusAction}><input type="hidden" name="cohortId" value={cohort.id} /><input type="hidden" name="sessionId" value={session.id} /><select name="status" defaultValue={session.status}><option value="scheduled">Scheduled</option><option value="live">Live</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><button type="submit" className="os-button os-button-secondary">Update session</button></form>}
      </div>
      <CohortTabs cohortId={cohort.id} active="delivery" />

      <div className="os-session-facts">
        <div><Clock3 size={17} /><span>Duration<strong>{duration} minutes</strong></span></div>
        <div><MapPin size={17} /><span>Delivery<strong>{session.deliveryMode.replaceAll("_", " ")}</strong></span></div>
        <div><UsersRound size={17} /><span>Roster<strong>{learners.length} learners</strong></span></div>
        <div><CheckCircle2 size={17} /><span>Recorded attendance<strong>{attended}/{learners.length} attended</strong></span></div>
      </div>

      <section className="os-panel os-attendance-panel">
        <div className="os-panel-head"><div><span className="os-label">Attendance register</span><h2>Participation evidence</h2></div><small>Present and late count as attended</small></div>
        <div className="os-attendance-list">{learners.map(({ enrollment, application, attendance }) => application && <article key={enrollment.id}>
          <div className="os-person"><span>{initials(application.fullName)}</span><div><strong>{application.fullName}</strong><small>{application.track}</small></div></div>
          {canManage ? <form action={markAttendanceAction}>
            <input type="hidden" name="cohortId" value={cohort.id} /><input type="hidden" name="sessionId" value={session.id} /><input type="hidden" name="enrollmentId" value={enrollment.id} />
            <select name="status" defaultValue={attendance?.status ?? "present"}><option value="present">Present</option><option value="late">Late</option><option value="excused">Excused</option><option value="absent">Absent</option></select>
            <label><span>Minutes</span><input name="minutesAttended" type="number" min="0" max={duration} defaultValue={attendance?.minutesAttended ?? duration} /></label>
            <input name="notes" defaultValue={attendance?.notes ?? ""} placeholder="Optional note" />
            <button type="submit" className="os-button os-button-secondary">{attendance ? "Update" : "Record"}</button>
          </form> : <span className={`os-state-pill is-${attendance?.status ?? "unmarked"}`}>{attendance?.status ?? "unmarked"}</span>}
        </article>)}</div>
      </section>
    </div>
  );
}
