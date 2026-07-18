import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, CTA, FAQ, SectionHeading } from "@/components/UI";
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Readiness Assessment in Dubai and the UAE",
  description: "Assess AI skills, workflow opportunities, governance risks and implementation priorities with Lymora's organisational AI readiness assessment.",
  path: "/enterprise/ai-readiness-assessment",
  keywords: ["AI readiness assessment Dubai", "AI readiness assessment UAE", "AI maturity assessment", "enterprise AI consulting Dubai"]
});

const faq = [
  { q: "What does the assessment cover?", a: "People, workflows, systems, information risk, management readiness and high-potential use cases." },
  { q: "What do we receive?", a: "A readiness profile, prioritised workflow opportunities, risk observations and a recommended next-step roadmap." },
  { q: "Is this a technical audit?", a: "It is an operating and capability assessment. Deeper security, legal or infrastructure audits may require specialist partners." }
];

export default function AssessmentPage() {
  return <>
    <JsonLd data={[
      serviceSchema({ name: "AI Readiness Assessment", description: metadata.description as string, path: "/enterprise/ai-readiness-assessment", audience: "Organisations evaluating AI adoption", offers: ["AI readiness profile", "Prioritised workflow opportunities", "Risk observations", "Implementation roadmap"] }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Enterprise", path: "/enterprise" }, { name: "AI Readiness Assessment", path: "/enterprise/ai-readiness-assessment" }]),
      faqSchema(faq)
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Enterprise",href:"/enterprise"},{label:"AI Readiness Assessment"}]}/><span className="eyebrow">AI readiness assessment in the UAE</span><h1>Know where AI can create value—and where it should not be used.</h1><p>A structured assessment of people, processes, risks and implementation priorities.</p><div className="hero-actions"><Link href="/contact?interest=readiness" className="button">Request an assessment</Link></div></div></section>
    <section><div className="container"><SectionHeading eyebrow="Assessment areas" title="A clear view of organisational readiness."/><div className="cards-3">{["People and skills","Workflow opportunity","Data and information risk","Leadership readiness","Tool and system environment","Adoption and governance"].map((x,i)=><div className="card" key={x}><span className="card-number">{String(i+1).padStart(2,"0")}</span><h3>{x}</h3></div>)}</div></div></section>
    <section><div className="container"><SectionHeading eyebrow="Frequently asked questions" title="Before the assessment."/><FAQ items={faq}/></div></section>
    <CTA title="Make the first AI decision with evidence." text="Request a scoping call to define the assessment depth, stakeholder group and priority business area." primary="Request assessment" primaryHref="/contact?interest=readiness" />
  </>;
}
