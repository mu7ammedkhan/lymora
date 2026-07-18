import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { StatusBadge } from "@/components/os/StatusBadge";
import { requireUser } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { applicationStatuses } from "@/lib/os/types";
import { formatDate, initials, relativeTime } from "@/lib/os/utils";

export default async function CommandCentrePage() {
  const user = await requireUser();
  const database = await readDatabase();
  if (user.role === "candidate") return <CandidateDashboard user={user} database={database} />;

  const activeApplications = database.applications.filter((application) => !["declined", "waitlisted"].includes(application.status));
  const newApplications = database.applications.filter((application) => application.status === "new");
  const interviews = database.applications.filter((application) => application.status === "interview");
  const accepted = database.applications.filter((application) => application.status === "accepted");
  const primaryCohort = database.cohorts.find((cohort) => cohort.status === "enrolling") ?? database.cohorts[0];
  const cohortEnrollments = database.enrollments.filter((enrollment) => enrollment.cohortId === primaryCohort?.id);
  const occupancy = primaryCohort ? Math.round((cohortEnrollments.length / primaryCohort.capacity) * 100) : 0;
  const recentApplications = [...database.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const usersById = new Map(database.users.map((member) => [member.id, member.name]));

  return (
    <div className="os-page">
      <div className="os-page-head">
        <div>
          <span className="os-label">Sunday, 19 July</span>
          <h1>Good morning, {user.name.split(" ")[0]}.</h1>
          <p>Here is what needs attention across Academy operations today.</p>
        </div>
        <div className="os-page-actions">
          <Link href="/app/admissions?status=new" className="os-button os-button-secondary">Review new applications</Link>
          <Link href="/caio#apply" className="os-button">Open application page <ArrowRight size={15} /></Link>
        </div>
      </div>

      <div className="os-attention-bar">
        <div><Sparkles size={18} /><span><strong>{newApplications.length} new applications</strong> are waiting for first review.</span></div>
        <Link href="/app/admissions?status=new">Review queue <ChevronRight size={16} /></Link>
      </div>

      <div className="os-metrics">
        <Metric label="Active pipeline" value={String(activeApplications.length)} note="Across four review stages" icon={<UsersRound size={18} />} />
        <Metric label="New this week" value={String(newApplications.length)} note="Requires first review" icon={<FileCheck2 size={18} />} accent />
        <Metric label="Interviews" value={String(interviews.length)} note="Candidates in review" icon={<UserRoundCheck size={18} />} />
        <Metric label="Cohort occupancy" value={`${occupancy}%`} note={`${cohortEnrollments.length} of ${primaryCohort?.capacity ?? 0} places confirmed`} icon={<CalendarDays size={18} />} />
      </div>

      <div className="os-dashboard-grid">
        <section className="os-panel os-pipeline-panel">
          <div className="os-panel-head"><div><span className="os-label">Admissions health</span><h2>CAIO pipeline</h2></div><Link href="/app/admissions">View all <ArrowRight size={14} /></Link></div>
          <div className="os-pipeline-summary"><strong>{database.applications.length}</strong><span>Total applications</span><small>{accepted.length} accepted</small></div>
          <div className="os-pipeline-bars">
            {applicationStatuses.slice(0, 4).map((status) => {
              const count = database.applications.filter((application) => application.status === status).length;
              const width = Math.max(8, Math.round((count / Math.max(database.applications.length, 1)) * 100));
              return <div key={status}><span>{status}</span><div><i style={{ width: `${width}%` }} /></div><strong>{count}</strong></div>;
            })}
          </div>
          <div className="os-pipeline-foot"><CircleAlert size={15} /><span>{newApplications.length} records have no reviewer assigned</span></div>
        </section>

        <section className="os-panel os-cohort-panel">
          <div className="os-panel-head"><div><span className="os-label">Next programme</span><h2>{primaryCohort?.code}</h2></div><StatusBadge status={primaryCohort?.status ?? "draft"} /></div>
          <h3>{primaryCohort?.name}</h3>
          <div className="os-cohort-date"><CalendarDays size={17} /><div><span>Starts</span><strong>{primaryCohort ? formatDate(primaryCohort.startDate) : "Not scheduled"}</strong></div></div>
          <div className="os-cohort-date"><Clock3 size={17} /><div><span>Schedule</span><strong>{primaryCohort?.schedule}</strong></div></div>
          <div className="os-occupancy"><div><span>Confirmed capacity</span><strong>{cohortEnrollments.length}/{primaryCohort?.capacity}</strong></div><progress value={cohortEnrollments.length} max={primaryCohort?.capacity || 1} /></div>
          <Link href={`/app/cohorts/${primaryCohort?.id}`} className="os-button os-button-secondary">Open cohort workspace <ArrowRight size={14} /></Link>
        </section>
      </div>

      <div className="os-dashboard-grid os-dashboard-lower">
        <section className="os-panel os-table-panel">
          <div className="os-panel-head"><div><span className="os-label">Live intake</span><h2>Recent applications</h2></div><Link href="/app/admissions">All applications <ArrowRight size={14} /></Link></div>
          <div className="os-table-wrap">
            <table className="os-table">
              <thead><tr><th>Applicant</th><th>Track</th><th>Status</th><th>Applied</th><th aria-label="Open" /></tr></thead>
              <tbody>{recentApplications.map((application) => (
                <tr key={application.id}>
                  <td><Link href={`/app/admissions/${application.id}`} className="os-person"><span>{initials(application.fullName)}</span><div><strong>{application.fullName}</strong><small>{application.currentRole}</small></div></Link></td>
                  <td>{application.track}</td><td><StatusBadge status={application.status} /></td><td>{relativeTime(application.createdAt)}</td>
                  <td><Link href={`/app/admissions/${application.id}`} aria-label={`Open ${application.fullName}`} className="os-row-open"><ChevronRight size={16} /></Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className="os-panel os-activity-panel">
          <div className="os-panel-head"><div><span className="os-label">Audit trail</span><h2>Latest activity</h2></div><Link href="/app/activity">View log</Link></div>
          <div className="os-activity-list">{database.activities.slice(0, 5).map((activity) => (
            <div key={activity.id}><i /><div><strong>{activity.detail}</strong><span>{activity.actorId ? usersById.get(activity.actorId) : "System"} · {relativeTime(activity.createdAt)}</span></div></div>
          ))}</div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, note, icon, accent = false }: { label: string; value: string; note: string; icon: React.ReactNode; accent?: boolean }) {
  return <div className={`os-metric ${accent ? "is-accent" : ""}`}><div><span>{label}</span>{icon}</div><strong>{value}</strong><small>{note}</small></div>;
}

function CandidateDashboard({ user, database }: { user: Awaited<ReturnType<typeof requireUser>>; database: Awaited<ReturnType<typeof readDatabase>> }) {
  const application = database.applications.find((item) => item.id === user.applicationId);
  const enrollment = database.enrollments.find((item) => item.applicationId === application?.id);
  const cohort = database.cohorts.find((item) => item.id === enrollment?.cohortId);
  const checklist = [
    { label: "Accept your place", done: true },
    { label: "Complete learner profile", done: true },
    { label: "Upload identity document", done: false },
    { label: "Sign learner commitment", done: false },
  ];

  return (
    <div className="os-page os-candidate-page">
      <div className="os-page-head"><div><span className="os-label">Candidate workspace</span><h1>Welcome, {user.name.split(" ")[0]}.</h1><p>Your CAIO journey is ready. Complete the remaining steps before the cohort begins.</p></div><StatusBadge status={application?.status ?? "new"} /></div>
      <section className="os-candidate-hero">
        <div><span className="os-label">Certified AI Operations Professional</span><h2>{cohort?.name}</h2><p>Five weeks of applied learning, evidence-led assessment and responsible AI operations.</p><div className="os-candidate-meta"><span><CalendarDays size={16} /> {cohort ? formatDate(cohort.startDate) : "To be scheduled"}</span><span><Clock3 size={16} /> {cohort?.schedule}</span></div></div>
        <div className="os-progress-ring" style={{ "--progress": `${enrollment?.progress ?? 0}%` } as React.CSSProperties}><div><strong>{enrollment?.progress ?? 0}%</strong><span>Ready</span></div></div>
      </section>
      <div className="os-candidate-grid">
        <section className="os-panel"><div className="os-panel-head"><div><span className="os-label">Before you begin</span><h2>Onboarding checklist</h2></div><strong>2 of 4</strong></div><div className="os-checklist">{checklist.map((item) => <div key={item.label} className={item.done ? "is-done" : ""}><span>{item.done ? <Check size={15} /> : null}</span><strong>{item.label}</strong>{!item.done && <button type="button">Complete</button>}</div>)}</div></section>
        <section className="os-panel os-next-session"><span className="os-label">Coming up</span><div className="os-date-block"><strong>17</strong><span>AUG<br />2026</span></div><h2>Orientation and operating standards</h2><p>Live online · 7:00 PM GST</p><button className="os-button" type="button" disabled>Access opens 15 minutes before</button></section>
      </div>
    </div>
  );
}
