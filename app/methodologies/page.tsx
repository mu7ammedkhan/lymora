import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { methodologies } from "@/lib/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lymora AI Workforce Methodologies",
  description: "Explore Lymora's practical frameworks for AI instruction, human oversight, risk classification, workforce deployment, readiness and value measurement.",
  path: "/methodologies",
  keywords: ["AI workforce framework", "human in the loop workflow", "AI risk classification", "AI readiness framework", "responsible AI methodology"]
});

export default function MethodologiesPage() {
  return <>
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Methodologies", path: "/methodologies" }])}/>
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Methodologies"}]}/><span className="eyebrow">Lymora methods and intellectual property</span><h1>Trust is not a principle. It is a system.</h1><p>Six connected frameworks turn instruction, oversight, risk, readiness and value measurement into repeatable operating practice.</p></div></section>
    <section><div className="container"><SectionHeading eyebrow="Six connected frameworks" title="From instruction quality to measurable business value." text="These methods create a common language for leaders, teams, certified operators and client organisations."/><div className="cards-3">{methodologies.map((method,index)=><div className="card" key={method.name}><span className="card-number">{String(index+1).padStart(2,"0")}</span><h3>{method.name}</h3><p>{method.summary}</p></div>)}</div></div></section>
    <section className="dark-section"><div className="container split"><div><SectionHeading eyebrow="Human-in-the-loop by design" title="Human intent. AI-supported execution. Human verification." text="Material decisions remain owned by people. Workflows document the output, review standard and improvement cycle so responsible use becomes operational rather than aspirational."/></div><div className="process-panel">{["Define human intent and boundaries", "Apply AI to a controlled execution step", "Verify with qualified human judgement", "Record the outcome and evidence", "Improve the workflow and controls"].map((step,index)=><div key={step}><span>{String(index+1).padStart(2,"0")}</span><strong>{step}</strong></div>)}</div></div></section>
    <CTA title="Apply the Lymora system to your organisation." text="Start with a readiness assessment, workflow audit, team programme or managed AI workforce engagement." primary="Discuss your starting point" secondary="Explore AI solutions" secondaryHref="/ai-solutions" />
  </>;
}
