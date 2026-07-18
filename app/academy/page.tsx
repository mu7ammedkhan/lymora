import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({title:"AI Academy Dubai | Professional and Corporate AI Training",description:"Lymora Academy provides assessed AI certification, corporate training, leadership programmes and continuous development in Dubai and the UAE.",path:"/academy",keywords:["AI academy Dubai","AI certification UAE","corporate AI training Dubai","AI courses for professionals","AI leadership training"]});

export default function AcademyPage(){return <>
  <JsonLd data={breadcrumbSchema([{name:"Home",path:"/"},{name:"Lymora Academy",path:"/academy"}])}/>
  <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Academy"}]}/><span className="eyebrow">Lymora Academy</span><h1>AI capability is now a workforce standard.</h1><p>Build professionals, teams and leaders who can turn artificial intelligence into responsible, observable workplace performance.</p></div></section>
  <section><div className="container"><SectionHeading eyebrow="Learning pathways" title="Capability for every level of the AI-enabled workforce." text="Programmes connect foundational literacy, professional operation, leadership, team implementation and role specialisation."/><div className="cards-3">{[
    ["CAIO™ Certification","Professionals, jobseekers and internal AI champions","Design and operate responsible AI-enabled workflows.","/caio"],
    ["Team AI Enablement","Departments and organisation teams","Shared capability, workflow playbook and implementation plan.","/academy/team-ai-enablement"],
    ["AI Ready Professional","Employees and early-career professionals","Confident, responsible AI use in daily work.",null],
    ["AI Leader","Managers and executives","Lead responsible adoption and workforce change.","/ai-solutions/ai-leadership-training-dubai"],
    ["Operator Specialisations","Certified AI operators","Role depth in marketing, sales, operations or support.","/ai-workforce"],
    ["Annual Update Programme","Certified alumni and client teams","Maintain current skills, risks and operating practices.",null]
  ].map(([name,audience,outcome,href],index)=><div className="card" key={name}><span className="card-number">{String(index+1).padStart(2,"0")}</span><h3>{name}</h3><p><strong>{audience}</strong></p><p>{outcome}</p>{href?<Link className="text-link" href={href}>Explore pathway →</Link>:<span className="eyebrow">Planned programme</span>}</div>)}</div></div></section>
  <section className="dark-section"><div className="container split"><SectionHeading eyebrow="Academy standard" title="Evidence, not passive attendance." text="Lymora Academy is the capability engine of the company and the quality foundation for every deployed operator."/><div className="check-list">{["Practical workplace evidence", "Vendor-neutral capability", "Responsible-AI controls throughout", "Portfolio, capstone and professional review", "Connection to employment and deployment pathways", "Renewal and continuous professional development"].map(item=><div key={item}><i>✓</i><p>{item}</p></div>)}</div></div></section>
  <CTA title="Stop training for awareness. Build for performance." text="Tell us whether you are developing yourself, a department, a leadership team or a complete workforce." primary="Find the right pathway" secondary="Explore corporate programmes" secondaryHref="/ai-solutions/corporate-ai-training-dubai" />
  </>}
