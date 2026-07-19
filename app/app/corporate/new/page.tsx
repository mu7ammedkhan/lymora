import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createCorporateOpportunityAction } from "@/lib/os/actions";
import { corporatePackages } from "@/lib/os/corporate";
import { requireRole } from "@/lib/os/auth";

export default async function NewCorporateOpportunityPage() {
  await requireRole(["super_admin", "academy_ops"]);
  return (
    <div className="os-page os-form-page os-corporate-intake">
      <Link href="/app/corporate" className="os-back-link"><ArrowLeft size={15} /> Corporate pipeline</Link>
      <div className="os-page-head"><div><span className="os-label">Corporate intake</span><h1>Open an opportunity</h1><p>Capture the organisation, decision owner and first commercially meaningful next step.</p></div></div>
      <form action={createCorporateOpportunityAction} className="os-panel os-record-form">
        <div className="os-form-section"><span>01</span><div><h2>Organisation</h2><p>Ideal corporate customers are UAE and GCC teams with clear workflows and executive ownership.</p></div></div>
        <div className="os-form-grid">
          <label>Company name<input name="companyName" required /></label><label>Website<input type="url" name="website" placeholder="https://" /></label>
          <label>Industry<input name="industry" required /></label><label>Employee band<select name="employeeBand" defaultValue="21-50"><option>1-20</option><option>21-50</option><option>51-100</option><option>101-200</option><option>201-500</option><option>500+</option></select></label>
          <label>Location<input name="location" defaultValue="Dubai, UAE" required /></label><label>Lead source<input name="source" placeholder="Referral, website, roundtable" required /></label>
        </div>
        <div className="os-form-section"><span>02</span><div><h2>Decision owner</h2><p>Record the person responsible for implementation, budget or executive sponsorship.</p></div></div>
        <div className="os-form-grid">
          <label>Contact name<input name="contactName" required /></label><label>Job title<input name="contactTitle" /></label>
          <label>Email<input type="email" name="contactEmail" required /></label><label>Phone<input name="contactPhone" /></label>
        </div>
        <div className="os-form-section"><span>03</span><div><h2>Commercial hypothesis</h2><p>Start with a concrete enablement offer. The readiness diagnostic will validate scope and priorities.</p></div></div>
        <div className="os-form-grid">
          <label className="full">Opportunity title<input name="title" placeholder="Operations AI enablement pilot" required /></label>
          <label>Package<select name="package" defaultValue="team_enablement_15">{Object.entries(corporatePackages).map(([id, item]) => <option value={id} key={id}>{item.label} - {item.capacity}</option>)}</select></label>
          <label>Participants<input type="number" name="participantCount" min="1" max="10000" defaultValue="15" required /></label>
          <label>Enterprise custom value<input type="number" name="valueAed" min="0" placeholder="Only used for Enterprise" /></label><label>Expected close<input type="date" name="expectedCloseDate" /></label>
          <label>Next step<input name="nextStep" placeholder="Schedule discovery with COO" required /></label><label>Due date<input type="date" name="nextStepDueAt" /></label>
          <label className="full">Account notes<textarea name="notes" rows={4} /></label>
        </div>
        <div className="os-form-actions"><Link href="/app/corporate" className="os-button os-button-secondary">Cancel</Link><button type="submit" className="os-button">Open opportunity <ArrowRight size={15} /></button></div>
      </form>
    </div>
  );
}
