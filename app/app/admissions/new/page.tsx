import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createManualApplicationAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";

const tracks = ["Operations", "Executive support", "Marketing and content", "Sales and research", "HR and recruitment", "Customer experience"];

export default async function NewApplicantPage() {
  await requireRole(["super_admin", "academy_ops"]);
  return (
    <div className="os-page os-form-page">
      <Link href="/app/admissions" className="os-back-link"><ArrowLeft size={15} /> Admissions</Link>
      <div className="os-page-head"><div><span className="os-label">Manual intake</span><h1>Add an applicant</h1><p>Create a record for referrals, direct enquiries or assisted applications.</p></div></div>
      <form action={createManualApplicationAction} className="os-panel os-record-form">
        <div className="os-form-section"><span>01</span><div><h2>Professional profile</h2><p>Core contact and employment details.</p></div></div>
        <div className="os-form-grid">
          <label>Full name<input name="fullName" required /></label><label>Email address<input type="email" name="email" required /></label>
          <label>Mobile / WhatsApp<input name="phone" required /></label><label>Country and city<input name="location" required /></label>
          <label>Current role<input name="currentRole" required /></label><label>Industry<input name="industry" required /></label>
          <label>Preferred operator track<select name="track" defaultValue="" required><option value="" disabled>Select track</option>{tracks.map((track) => <option key={track}>{track}</option>)}</select></label>
          <label className="full">Internal notes<textarea name="notes" rows={4} placeholder="Context, referral source or first-review notes" /></label>
        </div>
        <div className="os-form-actions"><Link href="/app/admissions" className="os-button os-button-secondary">Cancel</Link><button type="submit" className="os-button">Create applicant <ArrowRight size={15} /></button></div>
      </form>
    </div>
  );
}
