import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Solutions for Businesses",
  description: "Choose the right Lymora pathway for AI readiness, team enablement, transformation or managed workforce deployment.",
  path: "/for-businesses"
});

const startingPoints = [
  ["AI Readiness Assessment", "See the opportunity, capability and risk before committing to a larger programme.", "/enterprise/ai-readiness-assessment", "Diagnose the position"],
  ["Team AI Enablement", "Turn a department into a confident, governed and workflow-ready AI-enabled team.", "/academy/team-ai-enablement", "Enable the team"],
  ["Enterprise AI Transformation", "Redesign priority work and establish the operating model required to scale it.", "/enterprise/ai-transformation", "Change the operating model"],
  ["AI Workforce Subscription", "Add trained operators, role-specific workflows and managed capability where capacity is constrained.", "/ai-workforce", "Build operating capacity"]
] as const;

export default function BusinessPage() {
  return <>
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={[{label:"Home",href:"/"},{label:"For Business"}]}/>
      <span className="eyebrow">For organisations</span>
      <h1>Your AI investment should show up in the work.</h1>
      <p>Build the capability, workflows and operating capacity required to turn ambition into visible business performance.</p>
    </div></section>
    <section><div className="container">
      <SectionHeading eyebrow="Choose your starting point" title="One company. A connected path from assessment to deployment." text="Begin where the constraint is clearest, then connect the next capability as the organisation is ready."/>
      <div className="offer-grid">
        {startingPoints.map(([title, text, href, action], index) => <Link className="card" href={href} key={title}>
          <span className="card-number">{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p><span className="text-link">{action} →</span>
        </Link>)}
      </div>
    </div></section>
    <CTA title="You do not need another disconnected AI initiative." text="A focused capability conversation will identify the first move that can create evidence, confidence and momentum." primary="Find the first move" />
  </>;
}
