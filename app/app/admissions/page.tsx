import Link from "next/link";
import { ArrowDownToLine, ChevronRight, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/os/StatusBadge";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { applicationStatuses, type ApplicationStatus } from "@/lib/os/types";
import { formatDate, initials } from "@/lib/os/utils";

export default async function AdmissionsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; track?: string }> }) {
  await requireRole(["super_admin", "academy_ops", "assessor"]);
  const database = await readDatabase();
  const filters = await searchParams;
  const query = filters.q?.trim().toLowerCase() ?? "";
  const status = applicationStatuses.includes(filters.status as ApplicationStatus) ? filters.status as ApplicationStatus : "all";
  const tracks = Array.from(new Set(database.applications.map((item) => item.track))).sort();
  const applications = database.applications
    .filter((item) => status === "all" || item.status === status)
    .filter((item) => !filters.track || item.track === filters.track)
    .filter((item) => !query || [item.fullName, item.email, item.currentRole, item.number].some((value) => value.toLowerCase().includes(query)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const counts = Object.fromEntries(applicationStatuses.map((item) => [item, database.applications.filter((application) => application.status === item).length]));

  return (
    <div className="os-page">
      <div className="os-page-head">
        <div><span className="os-label">Academy intake</span><h1>Admissions</h1><p>Review eligibility, document decisions and build each CAIO cohort.</p></div>
        <div className="os-page-actions"><a href="/api/applications/export" className="os-button os-button-secondary"><ArrowDownToLine size={15} /> Export</a><Link href="/app/admissions/new" className="os-button"><Plus size={16} /> Add applicant</Link></div>
      </div>

      <div className="os-admission-tabs">
        <FilterLink label="All" value="all" current={status} count={database.applications.length} />
        {applicationStatuses.slice(0, 5).map((item) => <FilterLink key={item} label={item} value={item} current={status} count={counts[item]} />)}
      </div>

      <section className="os-panel os-admissions-panel">
        <form className="os-filterbar">
          <label className="os-filter-search"><Search size={16} /><input name="q" defaultValue={filters.q} placeholder="Search name, email, role or ID" /></label>
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <label><SlidersHorizontal size={15} /><select name="track" defaultValue={filters.track ?? ""}><option value="">All operator tracks</option>{tracks.map((track) => <option key={track}>{track}</option>)}</select></label>
          <button type="submit" className="os-button os-button-secondary">Apply filters</button>
          {(filters.q || filters.track) && <Link href={status === "all" ? "/app/admissions" : `/app/admissions?status=${status}`} className="os-clear-filter">Clear</Link>}
        </form>
        <div className="os-list-summary"><strong>{applications.length} applicants</strong><span>Sorted by newest application</span></div>
        <div className="os-table-wrap">
          <table className="os-table os-admissions-table">
            <thead><tr><th>Applicant</th><th>Application</th><th>Operator track</th><th>Score</th><th>Status</th><th>Submitted</th><th aria-label="Open" /></tr></thead>
            <tbody>{applications.map((application) => (
              <tr key={application.id}>
                <td><Link href={`/app/admissions/${application.id}`} className="os-person"><span>{initials(application.fullName)}</span><div><strong>{application.fullName}</strong><small>{application.email}</small></div></Link></td>
                <td><strong className="os-mono">{application.number}</strong><small className="os-source">{application.source}</small></td>
                <td><strong className="os-cell-primary">{application.track}</strong><small>{application.currentRole}</small></td>
                <td><span className={application.score && application.score >= 75 ? "os-score is-pass" : "os-score"}>{application.score ?? "—"}</span></td>
                <td><StatusBadge status={application.status} /></td><td>{formatDate(application.createdAt, { day: "numeric", month: "short" })}</td>
                <td><Link href={`/app/admissions/${application.id}`} aria-label={`Open ${application.fullName}`} className="os-row-open"><ChevronRight size={16} /></Link></td>
              </tr>
            ))}</tbody>
          </table>
          {applications.length === 0 && <div className="os-empty"><Search size={22} /><strong>No applicants match these filters.</strong><Link href="/app/admissions">Clear all filters</Link></div>}
        </div>
      </section>
    </div>
  );
}

function FilterLink({ label, value, current, count }: { label: string; value: string; current: string; count: number }) {
  const href = value === "all" ? "/app/admissions" : `/app/admissions?status=${value}`;
  return <Link href={href} className={current === value ? "is-active" : ""}><span>{label}</span><strong>{count}</strong></Link>;
}
