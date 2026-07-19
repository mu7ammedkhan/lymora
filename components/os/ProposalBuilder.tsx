"use client";

import { useMemo, useState } from "react";
import { FilePlus2 } from "lucide-react";
import { createCorporateProposalAction } from "@/lib/os/actions";
import { calculateProposal, corporatePackages, formatAed, standardProposalScope } from "@/lib/os/corporate";
import type { CorporateOpportunity, CorporatePackage } from "@/lib/os/types";

export function ProposalBuilder({ opportunity }: { opportunity: CorporateOpportunity }) {
  const [selectedPackage, setSelectedPackage] = useState<CorporatePackage>(opportunity.package);
  const [subtotal, setSubtotal] = useState(corporatePackages[opportunity.package].price || opportunity.valueAed);
  const totals = useMemo(() => calculateProposal(subtotal), [subtotal]);
  const validUntil = new Date(Date.now() + 21 * 86_400_000).toISOString().slice(0, 10);
  function changePackage(value: CorporatePackage) {
    setSelectedPackage(value);
    const price = corporatePackages[value].price;
    if (price) setSubtotal(price);
  }
  return (
    <form action={createCorporateProposalAction} className="os-panel os-proposal-builder">
      <input type="hidden" name="opportunityId" value={opportunity.id} />
      <div className="os-panel-head"><div><span className="os-label">Commercial builder</span><h2>New proposal</h2></div><FilePlus2 size={20} /></div>
      <div className="os-form-grid">
        <label>Enablement package<select name="package" value={selectedPackage} onChange={(event) => changePackage(event.target.value as CorporatePackage)}>{Object.entries(corporatePackages).map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}</select></label>
        <label>Participants<input type="number" name="participantCount" min="1" max="10000" defaultValue={opportunity.participantCount} required /></label>
        <label>Fee excluding VAT<input type="number" name="subtotalAed" min="0" step="0.01" value={subtotal} onChange={(event) => setSubtotal(Number(event.target.value))} required /></label>
        <label>Valid until<input type="date" name="validUntil" defaultValue={validUntil} required /></label>
        <label className="full">Scope<textarea name="scope" rows={7} defaultValue={standardProposalScope} required /></label>
        <label>Delivery timeline<input name="timeline" defaultValue="Four weeks from kickoff" required /></label>
        <label>Commercial assumptions<textarea name="assumptions" rows={4} defaultValue="Training fees are payable in advance. VAT is excluded from listed fees. Software, travel and major customisation are priced separately." /></label>
      </div>
      <div className="os-proposal-totals"><span>Fee<strong>{formatAed(totals.subtotal)}</strong></span><span>VAT 5%<strong>{formatAed(totals.vat)}</strong></span><span>Total<strong>{formatAed(totals.total)}</strong></span></div>
      <div className="os-form-actions"><span className="os-form-assurance">Draft proposals remain internal until marked sent.</span><button className="os-button" type="submit"><FilePlus2 size={15} /> Create proposal</button></div>
    </form>
  );
}
