import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createWorkforceOperatorAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { operatorTypes } from "@/lib/os/workforce";

export default async function NewWorkforceOperatorPage() {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const availableProfiles = database.users.filter((user) => user.role === "operator" && !database.workforceOperators.some((operator) => operator.profileId === user.id));
  const availableApplications = database.applications.filter((application) => !database.workforceOperators.some((operator) => operator.applicationId === application.id));
  return (
    <div className="os-page os-form-page os-workforce-intake">
      <Link href="/app/workforce/operators" className="os-back-link"><ArrowLeft size={15} /> Talent bench</Link>
      <div className="os-page-head"><div><span className="os-label">Operator recruitment</span><h1>Add qualified talent</h1><p>Capture the evidence needed to screen, onboard and responsibly match an operator to client work.</p></div></div>
      <form action={createWorkforceOperatorAction} className="os-panel os-record-form">
        <div className="os-form-section"><span>01</span><div><h2>Identity and access</h2><p>Link an Academy application or operator login when one already exists.</p></div></div>
        <div className="os-form-grid">
          <label>Operator login<select name="profileId" defaultValue=""><option value="">Create without login</option>{availableProfiles.map((profile) => <option value={profile.id} key={profile.id}>{profile.name} - {profile.email}</option>)}</select></label>
          <label>Academy application<select name="applicationId" defaultValue=""><option value="">No linked application</option>{availableApplications.map((application) => <option value={application.id} key={application.id}>{application.fullName} - {application.status}</option>)}</select></label>
          <label>Full name<input name="fullName" required /></label><label>Email<input type="email" name="email" required /></label>
          <label>Phone<input name="phone" /></label><label>Location<input name="location" defaultValue="Dubai, UAE" required /></label>
        </div>
        <div className="os-form-section"><span>02</span><div><h2>Capability profile</h2><p>Select one initial role specialisation for the pilot and record evidence, not aspiration.</p></div></div>
        <div className="os-form-grid">
          <label>Operator role<select name="operatorType" defaultValue="operations">{Object.entries(operatorTypes).map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}</select></label>
          <label>Work mode<select name="workMode" defaultValue="hybrid"><option value="remote">Remote</option><option value="on_site">On site</option><option value="hybrid">Hybrid</option></select></label>
          <label className="full">Specialisation<input name="specialisation" placeholder="Operational reporting and workflow governance" required /></label>
          <label className="full">Skills, separated by commas<input name="skills" placeholder="Process mapping, source verification, SOP design" required /></label>
          <label className="full">Experience summary<textarea name="experienceSummary" rows={4} required /></label>
          <label>Readiness score<input type="number" name="readinessScore" min="0" max="100" defaultValue="70" required /></label>
          <label>Starting status<select name="status" defaultValue="onboarding"><option value="applicant">Applicant</option><option value="screening">Screening</option><option value="onboarding">Onboarding</option><option value="available">Available</option></select></label>
        </div>
        <div className="os-form-section"><span>03</span><div><h2>Capacity and economics</h2><p>Cost is internal. Client pricing is set separately when the operator is matched and deployed.</p></div></div>
        <div className="os-form-grid">
          <label>Monthly operator cost<input type="number" name="monthlyCostAed" min="0" defaultValue="5000" required /></label>
          <label>Monthly capacity hours<input type="number" name="capacityHoursMonth" min="1" max="744" defaultValue="160" required /></label>
          <label>Available from<input type="date" name="availableFrom" /></label>
        </div>
        <div className="os-form-actions"><Link href="/app/workforce/operators" className="os-button os-button-secondary">Cancel</Link><button type="submit" className="os-button">Create operator record <ArrowRight size={15} /></button></div>
      </form>
    </div>
  );
}
