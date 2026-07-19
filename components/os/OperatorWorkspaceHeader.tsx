import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Mail, MapPin } from "lucide-react";
import { operatorTypes, statusLabel } from "@/lib/os/workforce";
import type { WorkforceOperator } from "@/lib/os/types";

export function OperatorWorkspaceHeader({ operator }: { operator: WorkforceOperator }) {
  return (
    <>
      <Link href="/app/workforce/operators" className="os-back-link"><ArrowLeft size={15} /> Talent bench</Link>
      <div className="os-record-head os-operator-record-head">
        <div className="os-corporate-identity">
          <span><BriefcaseBusiness size={21} /></span>
          <div><div className="os-record-title"><h1>{operator.fullName}</h1><span className={`os-workforce-state is-${operator.status}`}>{statusLabel(operator.status)}</span></div><p>{operator.operatorNumber} - {operatorTypes[operator.operatorType].label}</p></div>
        </div>
        <div className="os-corporate-contact"><span><Mail size={13} />{operator.email}</span><span><MapPin size={13} />{operator.location}</span></div>
      </div>
    </>
  );
}
