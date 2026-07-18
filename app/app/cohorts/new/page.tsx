import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createCohortAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";

export default async function NewCohortPage() {
  await requireRole(["super_admin", "academy_ops"]);
  return (
    <div className="os-page os-form-page">
      <Link href="/app/cohorts" className="os-back-link"><ArrowLeft size={15} /> Cohorts</Link>
      <div className="os-page-head"><div><span className="os-label">Programme planning</span><h1>Create a cohort</h1><p>Set the dates, delivery pattern and controlled learner capacity.</p></div></div>
      <form action={createCohortAction} className="os-panel os-record-form">
        <div className="os-form-section"><span>01</span><div><h2>Cohort definition</h2><p>The cohort begins as a draft and can be opened for enrolment later.</p></div></div>
        <div className="os-form-grid">
          <label>Cohort code<input name="code" placeholder="CAIO-03" required /></label><label>Cohort name<input name="name" placeholder="CAIO Winter Cohort" required /></label>
          <label>Start date<input type="date" name="startDate" required /></label><label>End date<input type="date" name="endDate" required /></label>
          <label>Capacity<input type="number" name="capacity" min="1" max="500" defaultValue="24" required /></label><label>Delivery schedule<input name="schedule" placeholder="Mon & Thu, 7:00-9:00 PM GST" required /></label>
        </div>
        <div className="os-form-actions"><Link href="/app/cohorts" className="os-button os-button-secondary">Cancel</Link><button type="submit" className="os-button">Create draft cohort <ArrowRight size={15} /></button></div>
      </form>
    </div>
  );
}
