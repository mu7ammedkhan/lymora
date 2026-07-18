import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Lymora | AI Workforce Company UAE",
  description: "Lymora is a Dubai-based AI Workforce Company that recruits, trains, certifies, deploys and supports AI-enabled professionals and teams.",
  path: "/about",
  keywords: ["AI workforce company", "AI workforce UAE", "Lymora Dubai", "AI training and workforce company"]
});

export default function AboutPage() {
  return <>
    <JsonLd data={breadcrumbSchema([{name:"Home",path:"/"},{name:"About Lymora",path:"/about"}])}/>
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"About"}]}/><span className="eyebrow">About Lymora</span><h1>We are building the human operating layer for AI.</h1><p>The future of work will not be defined by AI alone, but by people who know how to direct it, verify it and turn it into progress.</p></div></section>
    <section><div className="container split"><div><SectionHeading eyebrow="Our purpose" title="Build workforces that know how to use AI effectively, responsibly and measurably." text="Lymora sits at the intersection of recruitment, professional certification, workforce deployment, workflow redesign and enterprise enablement."/><p className="prose">Unlike a traditional recruitment firm, consultancy or training provider, Lymora combines talent, capability development and ongoing operational support in one integrated model.</p></div><div className="card"><span className="eyebrow">Company thesis</span><h3>Human Meets Intelligence</h3><p>Businesses do not need more AI tools. They need people and workflows that know how to use them.</p><p><strong>Primary market:</strong> UAE and GCC organisations seeking practical implementation and workforce capability.</p></div></div></section>
    <section className="dark-section"><div className="container"><SectionHeading eyebrow="Vision, mission and promise" title="A trusted operating standard for the AI-enabled workforce."/><div className="cards-3">{[
      ["Vision","To become the world’s most trusted AI Workforce Company."],
      ["Mission","To recruit, train, deploy and support AI-enabled professionals who help businesses work smarter and scale faster."],
      ["Brand promise","Every professional Lymora trains or deploys is equipped to create responsible, measurable business impact."],
      ["Core model","Recruit. Train. Certify. Deploy. Manage. Improve."]
    ].map(([t,d])=><div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
    <section><div className="container"><SectionHeading eyebrow="Company architecture" title="Three capability engines. One master brand."/><div className="capability-list light-list">{[
      ["01","Lymora Academy","Professional certification, corporate programmes, leadership training and continuous development.","/academy"],
      ["02","Lymora Workforce","AI-enabled professionals deployed and supported through a managed recurring service.","/ai-workforce"],
      ["03","Lymora Enterprise","Readiness, workflow audits, governance, implementation and transformation services.","/enterprise"]
    ].map(([n,name,text,href])=><article className="capability-row" key={name}><span className="capability-number">{n}</span><div className="capability-name"><span>{name}</span><i/></div><div className="capability-story"><h3>{name}</h3><p>{text}</p></div><Link className="circle-link" href={href}>↗</Link></article>)}</div></div></section>
    <section className="muted-section"><div className="container split"><div><SectionHeading eyebrow="Enterprise-ready principles" title="Calm, rigorous and human-first."/><div className="check-list">{["Human oversight remains mandatory for material decisions", "Client data is used only under agreed controls", "Marketing claims must be supported by delivery evidence", "Certification standards remain protected from commercial pressure", "Operator performance and wellbeing are managed together", "Frameworks and assessments remain under version control"].map(item=><div key={item}><i>✓</i><p>{item}</p></div>)}</div></div><div><SectionHeading eyebrow="What Lymora is not" title="Clear boundaries build trust."/><div className="check-list">{["Not a generic recruitment agency", "Not a prompt-engineering workshop", "Not an AI software reseller", "Not a low-cost freelancer marketplace", "Not an ungoverned automation agency"].map(item=><div key={item}><i>—</i><p>{item}</p></div>)}</div></div></div></section>
    <CTA title="The workforce is becoming the AI strategy." text="Whether you need certified professionals, a stronger department or governed workflows, the right starting point should be clear and practical." primary="Meet Lymora" secondary="Explore our methodologies" secondaryHref="/methodologies" />
  </>;
}
