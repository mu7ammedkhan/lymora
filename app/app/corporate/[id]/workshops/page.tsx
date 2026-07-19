import { notFound } from "next/navigation";
import { CalendarPlus, Clock3, MapPin, UsersRound } from "lucide-react";
import { CorporateTabs } from "@/components/os/CorporateTabs";
import { CorporateWorkspaceHeader } from "@/components/os/CorporateWorkspaceHeader";
import { scheduleCorporateWorkshopAction, updateCorporateWorkshopStatusAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

const workshopLabels = { executive_readiness: "Executive readiness", team_enablement: "Team enablement", manager_coaching: "Manager coaching", workflow_lab: "Workflow lab" } as const;

export default async function CorporateWorkshopsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "academy_ops"]);
  const { id } = await params;
  const database = await readDatabase();
  const opportunity = database.corporateOpportunities.find((item) => item.id === id);
  const account = opportunity && database.corporateAccounts.find((item) => item.id === opportunity.accountId);
  if (!opportunity || !account) notFound();
  const proposals = database.corporateProposals.filter((item) => item.opportunityId === opportunity.id);
  const workshops = database.corporateWorkshops.filter((item) => item.opportunityId === opportunity.id).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const nextWeek = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 16);
  const nextWeekEnd = new Date(Date.now() + 7 * 86_400_000 + 2 * 3_600_000).toISOString().slice(0, 16);
  return (
    <div className="os-page os-corporate-workspace">
      <CorporateWorkspaceHeader account={account} opportunity={opportunity} />
      <CorporateTabs opportunityId={opportunity.id} active="workshops" />
      <div className="os-workshop-command"><div><span className="os-label">Enablement delivery</span><h2>Move from knowledge to changed work.</h2><p>Use executive readiness, role-specific training, workflow labs and manager coaching to carry priorities into a governed 30-day implementation.</p></div><CalendarPlus size={31} /></div>
      <section className="os-workshop-timeline">
        {workshops.map((workshop) => <article className="os-panel os-workshop-item" key={workshop.id}><time><strong>{formatDate(workshop.startsAt, { day: "2-digit" })}</strong><span>{formatDate(workshop.startsAt, { month: "short", year: "numeric" })}</span></time><div><div className="os-workshop-title"><span>{workshopLabels[workshop.workshopType]}</span><h3>{workshop.title}</h3></div><p>{workshop.outcomes || "Outcomes to be confirmed."}</p><footer><span><Clock3 size={13} />{formatDate(workshop.startsAt, { hour: "numeric", minute: "2-digit" })} - {formatDate(workshop.endsAt, { hour: "numeric", minute: "2-digit" })}</span><span><MapPin size={13} />{workshop.location || workshop.deliveryMode.replaceAll("_", " ")}</span><span><UsersRound size={13} />{workshop.participantTarget} people</span></footer></div><form action={updateCorporateWorkshopStatusAction}><input type="hidden" name="opportunityId" value={opportunity.id} /><input type="hidden" name="workshopId" value={workshop.id} /><select name="status" defaultValue={workshop.status}><option value="planned">Planned</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><button className="os-table-action" type="submit">Update</button></form></article>)}
        {workshops.length === 0 && <div className="os-panel os-quiet-empty">No workshops scheduled for this engagement.</div>}
      </section>
      <form action={scheduleCorporateWorkshopAction} className="os-panel os-compact-corporate-form">
        <input type="hidden" name="opportunityId" value={opportunity.id} />
        <div className="os-panel-head"><div><span className="os-label">Delivery planning</span><h2>Schedule a workshop</h2></div><CalendarPlus size={19} /></div>
        <div className="os-form-grid">
          <label className="full">Workshop title<input name="title" placeholder="Executive AI readiness session" required /></label>
          <label>Type<select name="workshopType" defaultValue="executive_readiness">{Object.entries(workshopLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label>Related proposal<select name="proposalId" defaultValue=""><option value="">No linked proposal</option>{proposals.map((proposal) => <option value={proposal.id} key={proposal.id}>{proposal.proposalNumber}</option>)}</select></label>
          <label>Starts<input type="datetime-local" name="startsAt" defaultValue={nextWeek} required /></label><label>Ends<input type="datetime-local" name="endsAt" defaultValue={nextWeekEnd} required /></label>
          <label>Delivery mode<select name="deliveryMode" defaultValue="in_person"><option value="in_person">In person</option><option value="live_online">Live online</option><option value="hybrid">Hybrid</option></select></label><label>Location<input name="location" placeholder="Dubai or meeting room" /></label>
          <label>Join URL<input type="url" name="joinUrl" placeholder="https://" /></label><label>Facilitator<input name="facilitator" defaultValue="Lymora Enablement" required /></label>
          <label>Participant target<input type="number" name="participantTarget" min="1" max="10000" defaultValue={opportunity.participantCount} required /></label><label>Outcomes<input name="outcomes" placeholder="Decisions or workflows produced" /></label>
          <label className="full">Delivery notes<textarea name="notes" rows={3} /></label>
        </div>
        <div className="os-form-actions"><button type="submit" className="os-button"><CalendarPlus size={15} /> Schedule workshop</button></div>
      </form>
    </div>
  );
}
