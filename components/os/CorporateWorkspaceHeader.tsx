import Link from "next/link";
import { ArrowLeft, Building2, Mail, MapPin } from "lucide-react";
import { corporatePackages } from "@/lib/os/corporate";
import type { CorporateAccount, CorporateOpportunity } from "@/lib/os/types";

export function CorporateWorkspaceHeader({ account, opportunity }: { account: CorporateAccount; opportunity: CorporateOpportunity }) {
  return (
    <>
      <Link href="/app/corporate" className="os-back-link"><ArrowLeft size={15} /> Corporate pipeline</Link>
      <div className="os-record-head os-corporate-record-head">
        <div className="os-corporate-identity">
          <span><Building2 size={21} /></span>
          <div><div className="os-record-title"><h1>{account.companyName}</h1><span className={`os-stage-pill is-${opportunity.stage}`}>{opportunity.stage}</span></div><p>{opportunity.title} - {corporatePackages[opportunity.package].label}</p></div>
        </div>
        <div className="os-corporate-contact"><span><Mail size={13} />{account.primaryContactName}</span><span><MapPin size={13} />{account.location}</span></div>
      </div>
    </>
  );
}
