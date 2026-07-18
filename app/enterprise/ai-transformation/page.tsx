import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Enterprise AI Transformation Services in Dubai",
  description: "Enterprise AI transformation combining workflow redesign, workforce capability, responsible AI governance, implementation and measurable adoption.",
  path: "/enterprise/ai-transformation",
  keywords: ["AI transformation Dubai", "enterprise AI consulting UAE", "AI workflow transformation", "AI adoption consulting Dubai"]
});

export default function TransformationPage() {
  return <>
    <JsonLd data={[
      serviceSchema({ name: "Enterprise AI Transformation", description: metadata.description as string, path: "/enterprise/ai-transformation", audience: "Enterprises implementing AI at scale", offers: ["AI discovery and assessment", "Workflow redesign", "Team enablement", "Implementation pilot", "Scale and governance", "Continuous improvement"] }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Enterprise", path: "/enterprise" }, { name: "AI Transformation", path: "/enterprise/ai-transformation" }])
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Enterprise",href:"/enterprise"},{label:"AI Transformation"}]}/><span className="eyebrow">Enterprise AI transformation in Dubai</span><h1>Redesign work around human judgement and intelligent execution.</h1><p>Move from scattered experiments to controlled workflows, capable teams and measurable adoption.</p><div className="hero-actions"><Link href="/contact?interest=transformation" className="button">Discuss transformation</Link></div></div></section>
    <section><div className="container"><SectionHeading eyebrow="Transformation model" title="A phased operating programme."/><div className="cards-3">{[["01","Discover","Assess capability, workflows, systems, governance and stakeholders."],["02","Design","Prioritise use cases and create future-state workflows with human controls."],["03","Enable","Train teams, build playbooks and prepare managers for adoption."],["04","Pilot","Implement selected workflows, test quality and capture evidence."],["05","Scale","Standardise what works and expand with governance and measurement."],["06","Improve","Review outcomes, update capability and strengthen controls."]].map(([n,t,d])=><div className="card" key={t}><span className="card-number">{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
    <CTA title="Move from AI projects to an operating capability." text="Transformation scope is developed around business priorities, workforce needs and risk—not a standard technology package." primary="Start a conversation" primaryHref="/contact?interest=transformation" />
  </>;
}
