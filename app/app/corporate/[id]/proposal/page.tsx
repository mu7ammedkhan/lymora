import { notFound } from "next/navigation";
import { CheckCircle2, FileText, Send } from "lucide-react";
import { CorporateTabs } from "@/components/os/CorporateTabs";
import { CorporateWorkspaceHeader } from "@/components/os/CorporateWorkspaceHeader";
import { ProposalBuilder } from "@/components/os/ProposalBuilder";
import { updateProposalStatusAction } from "@/lib/os/actions";
import { corporatePackages, formatAed } from "@/lib/os/corporate";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

export default async function CorporateProposalPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops"]);
  const { id } = await params;
  const database = await readDatabase();
  const opportunity = database.corporateOpportunities.find((item) => item.id === id);
  const account = opportunity && database.corporateAccounts.find((item) => item.id === opportunity.accountId);
  if (!opportunity || !account) notFound();
  const proposals = database.corporateProposals.filter((item) => item.opportunityId === opportunity.id);
  return (
    <div className="os-page os-corporate-workspace">
      <CorporateWorkspaceHeader account={account} opportunity={opportunity} />
      <CorporateTabs opportunityId={opportunity.id} active="proposal" />
      <div className="os-commercial-standard"><div><span className="os-label">Commercial standard</span><h2>Clear scope. Credible outcomes. No theatre.</h2><p>Every proposal separates fees from VAT, software, travel and major customisation. Training is charged in advance and productivity multipliers are never guaranteed.</p></div><CheckCircle2 size={30} /></div>
      {proposals.length > 0 && <section className="os-proposal-list"><div className="os-section-heading"><div><span className="os-label">Proposal register</span><h2>{proposals.length} commercial document{proposals.length === 1 ? "" : "s"}</h2></div></div>{proposals.map((proposal) => <article className="os-panel os-proposal-item" key={proposal.id}><header><div><span>{proposal.proposalNumber}</span><h3>{corporatePackages[proposal.package].label}</h3><small>{proposal.participantCount} participants - valid until {formatDate(proposal.validUntil)}</small></div><span className={`os-proposal-state is-${proposal.status}`}>{proposal.status}</span></header><div className="os-proposal-scope"><div><span className="os-label">Scope</span>{proposal.scope.split("\n").map((line) => <p key={line}>{line}</p>)}</div><dl><div><dt>Fee</dt><dd>{formatAed(proposal.subtotalAed)}</dd></div><div><dt>VAT</dt><dd>{formatAed(proposal.vatAed)}</dd></div><div><dt>Total</dt><dd>{formatAed(proposal.totalAed)}</dd></div></dl></div><footer><span>{proposal.timeline}</span><form action={updateProposalStatusAction}><input type="hidden" name="opportunityId" value={opportunity.id} /><input type="hidden" name="proposalId" value={proposal.id} /><select name="status" defaultValue={proposal.status}><option value="draft">Draft</option><option value="sent">Sent</option><option value="accepted">Accepted</option><option value="declined">Declined</option><option value="expired">Expired</option></select><button className="os-button os-button-secondary" type="submit"><Send size={14} /> Update</button></form></footer></article>)}</section>}
      {proposals.length === 0 && <div className="os-panel os-empty os-proposal-empty"><FileText size={22} /><strong>No proposals created yet.</strong><span>Use the commercial builder below after the readiness scope is clear.</span></div>}
      <ProposalBuilder opportunity={opportunity} />
    </div>
  );
}
