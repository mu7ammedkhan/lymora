import Link from "next/link";
import { ArrowRight, CalendarDays, Plus, UsersRound } from "lucide-react";
import { StatusBadge } from "@/components/os/StatusBadge";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

export default async function CohortsPage() {
  await requireRole(["super_admin", "academy_ops", "assessor"]);
  const database = await readDatabase();
  return (
    <div className="os-page">
      <div className="os-page-head"><div><span className="os-label">Programme operations</span><h1>CAIO cohorts</h1><p>Plan delivery, control capacity and move accepted candidates into learning.</p></div><Link href="/app/cohorts/new" className="os-button"><Plus size={16} /> Create cohort</Link></div>
      <div className="os-cohort-list">
        {database.cohorts.map((cohort) => {
          const enrollments = database.enrollments.filter((item) => item.cohortId === cohort.id);
          const occupancy = Math.round((enrollments.length / cohort.capacity) * 100);
          return (
            <Link href={`/app/cohorts/${cohort.id}`} className="os-cohort-card" key={cohort.id}>
              <div className="os-cohort-card-top"><span>{cohort.code}</span><StatusBadge status={cohort.status} /></div>
              <div><span className="os-label">Certified AI Operations Professional</span><h2>{cohort.name}</h2></div>
              <div className="os-cohort-card-meta"><span><CalendarDays size={16} />{formatDate(cohort.startDate)} - {formatDate(cohort.endDate, { day: "numeric", month: "short" })}</span><span><UsersRound size={16} />{enrollments.length} of {cohort.capacity} places</span></div>
              <div className="os-card-progress"><div><span>Occupancy</span><strong>{occupancy}%</strong></div><progress max={cohort.capacity} value={enrollments.length} /></div>
              <div className="os-cohort-card-link">Open workspace <ArrowRight size={15} /></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
