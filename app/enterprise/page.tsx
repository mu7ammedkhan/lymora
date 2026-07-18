import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export const metadata = pageMetadata({ title:"Enterprise AI Readiness and Transformation UAE", description:"AI readiness, workflow audits, governance, implementation and managed AI operations for UAE organisations.", path:"/enterprise", keywords:["enterprise AI consulting UAE","AI transformation Dubai","AI readiness assessment","AI workflow audit","responsible AI governance"] });

const services = [
  ["AI Readiness Assessment","Assess leadership, people, process, data, tools, governance and adoption.","/enterprise/ai-readiness-assessment"],
  ["AI Workflow Audit","Map current processes and create a prioritised opportunity register.","/ai-solutions/ai-workflow-audit"],
  ["AI Operating Playbook","Create policies, workflow rules, templates and human oversight standards.","/ai-solutions/responsible-ai-governance"],
  ["Implementation Sprint","Build, test and document selected AI-enabled workflows.","/ai-solutions/ai-implementation-services-dubai"],
  ["Managed AI Operations","Provide operators, quality assurance, reporting and continuous improvement.","/ai-solutions/managed-ai-operations"],
  ["Leadership Advisory","Support executive decisions, governance and workforce change.","/ai-solutions/ai-leadership-training-dubai"]
] as const;

export default function EnterprisePage(){return <>
  <JsonLd data={[serviceSchema({name:"Lymora Enterprise AI Services",description:"Readiness, workflow redesign, governance, implementation and managed AI operations for UAE organisations.",path:"/enterprise",audience:"Leaders and organisations in the UAE",offers:services.map(item=>item[0])}),breadcrumbSchema([{name:"Home",path:"/"},{name:"Enterprise",path:"/enterprise"}])]}/>
  <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Enterprise"}]}/><span className="eyebrow">Lymora Enterprise</span><h1>Make AI operational, governed and measurable.</h1><p>Move beyond scattered pilots with a clear operating model for capability, workflows, controls and continuous improvement.</p><div className="hero-actions"><Link className="button" href="/contact">Define the enterprise priority</Link></div></div></section>
  <section><div className="container"><SectionHeading eyebrow="Enterprise services" title="From readiness to implementation." text="Begin with evidence, then choose the intervention that matches your organisation’s capability, workflow maturity and risk."/><div className="solution-grid">{services.map(([name,text,href],index)=><Link href={href} className="solution-card" key={name}><span className="eyebrow">Service {String(index+1).padStart(2,"0")}</span><h3>{name}</h3><p>{text}</p><span className="text-link">Explore service →</span></Link>)}</div></div></section>
  <section className="dark-section"><div className="container"><SectionHeading eyebrow="Enterprise pathway" title="Diagnose. Prioritise. Enable. Implement. Deploy. Manage."/><div className="cards-3">{[
    ["01","Diagnose","Assess readiness, capability, workflows and risk."],
    ["02","Prioritise","Select opportunities based on value and feasibility."],
    ["03","Enable","Train leaders, managers and responsible teams."],
    ["04","Implement","Build, test and document controlled workflows."],
    ["05","Deploy","Add certified operators where capacity is required."],
    ["06","Manage","Track value, quality, risk and adoption."]
  ].map(([n,t,d])=><div className="card" key={t}><span className="card-number">{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
  <section><div className="container split"><SectionHeading eyebrow="Repeatable methodology" title="Shared frameworks keep every engagement accountable." text="Lymora connects instruction quality, human oversight, risk classification, readiness scoring and value measurement through one operating language."/><div><div className="check-list">{["CLEAR™ Instruction Framework","HITL Workflow Model™","Lymora AI Risk Classification","AI Workforce Framework™","Lymora AI Readiness Score","Value Realisation Canvas"].map(item=><div key={item}><i>✓</i><p>{item}</p></div>)}</div><p><Link className="text-link" href="/methodologies">Explore the methodologies →</Link></p></div></div></section>
  <CTA title="AI transformation should change the work." text="Start with the organisation, teams and workflows, then build the controls and capability required to implement." primary="Design the roadmap" />
  </>}
