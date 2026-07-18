import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import { updateApplicationAction } from "@/lib/os/actions";
import { StatusBadge } from "@/components/os/StatusBadge";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { applicationStatuses } from "@/lib/os/types";
import { formatDate, initials, relativeTime } from "@/lib/os/utils";

export default async function ApplicantRecordPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops", "assessor"]);
  const { id } = await params;
  const database = await readDatabase();
  const application = database.applications.find((item) => item.id === id);
  if (!application) notFound();
  const reviewer = database.users.find((item) => item.id === application.reviewedBy);
  const activity = database.activities.filter((item) => item.entityType === "application" && item.entityId === application.id);

  return (
    <div className="os-page os-record-page">
      <Link href="/app/admissions" className="os-back-link"><ArrowLeft size={15} /> Admissions</Link>
      <div className="os-record-head">
        <div className="os-record-person"><span>{initials(application.fullName)}</span><div><div className="os-record-title"><h1>{application.fullName}</h1><StatusBadge status={application.status} /></div><p>{application.currentRole} · {application.industry}</p></div></div>
        <div className="os-record-id"><span>Application</span><strong>{application.number}</strong><small>Submitted {formatDate(application.createdAt)}</small></div>
      </div>

      <div className="os-record-grid">
        <div className="os-record-main">
          <section className="os-panel os-profile-panel">
            <div className="os-panel-head"><div><span className="os-label">Eligibility evidence</span><h2>Candidate profile</h2></div></div>
            <div className="os-contact-strip">
              <a href={`mailto:${application.email}`}><Mail size={15} /><span>{application.email}</span></a>
              <a href={`tel:${application.phone}`}><Phone size={15} /><span>{application.phone}</span></a>
              <span><MapPin size={15} />{application.location}</span>
              {application.linkedinUrl && <a href={application.linkedinUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} />LinkedIn</a>}
            </div>
            <div className="os-evidence-grid">
              <Evidence label="Experience" value={application.experience} />
              <Evidence label="Current AI use" value={application.aiLevel} />
              <Evidence label="Preferred track" value={application.track} />
              <Evidence label="Schedule commitment" value={application.scheduleCommitment} />
              <Evidence label="Investment readiness" value={application.investmentReadiness} />
              <Evidence label="Source" value={application.source} />
            </div>
            <div className="os-written-evidence"><span>Workflow to improve</span><p>{application.workflowGoal || "Not provided for this manually created application."}</p></div>
            <div className="os-written-evidence"><span>Why CAIO, why now</span><p>{application.motivation || "Not provided for this manually created application."}</p></div>
          </section>

          <section className="os-panel os-timeline-panel">
            <div className="os-panel-head"><div><span className="os-label">Record history</span><h2>Activity</h2></div></div>
            <div className="os-record-timeline">
              {activity.map((item) => <div key={item.id}><i /><div><strong>{item.detail}</strong><span>{relativeTime(item.createdAt)}</span></div></div>)}
              <div><i /><div><strong>Application submitted through {application.source}</strong><span>{formatDate(application.createdAt, { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}</span></div></div>
            </div>
          </section>
        </div>

        <aside className="os-record-sidebar">
          <form action={updateApplicationAction} className="os-panel os-review-panel">
            <div className="os-panel-head"><div><span className="os-label">Admissions decision</span><h2>Review</h2></div></div>
            <input type="hidden" name="applicationId" value={application.id} />
            <label>Status<select name="status" defaultValue={application.status}>{applicationStatuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></label>
            <label>Eligibility score <span>0-100</span><input type="number" name="score" min="0" max="100" defaultValue={application.score ?? ""} placeholder="Not scored" /></label>
            <label>Internal review notes<textarea name="notes" rows={7} defaultValue={application.notes} placeholder="Evidence, concerns and decision rationale" /></label>
            <button type="submit" className="os-button"><Save size={15} /> Save review</button>
            <small>Last reviewed by {reviewer?.name ?? "No reviewer"}</small>
          </form>
          <section className="os-panel os-record-meta">
            <h3>Record details</h3>
            <div><UserRound size={15} /><span><small>Owner</small><strong>{reviewer?.name ?? "Unassigned"}</strong></span></div>
            <div><CalendarDays size={15} /><span><small>Last updated</small><strong>{formatDate(application.updatedAt)}</strong></span></div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Evidence({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
