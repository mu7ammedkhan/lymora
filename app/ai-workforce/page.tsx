import Link from "next/link";
import { Breadcrumbs, CTA, FAQ, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { operatorRoles } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Managed AI Workforce Solutions UAE",
  description: "Recruit, train, certify, deploy and manage AI-enabled professionals through Lymora's AI Workforce as a Service model in the UAE.",
  path: "/ai-workforce",
  keywords: ["AI workforce UAE", "AI workforce as a service", "AI-enabled professionals", "managed AI services Dubai", "AI operators"]
});

export default function AIWorkforcePage() {
  const faqs = [
    { q: "What is AI Workforce as a Service?", a: "It is a managed service combining role design, recruitment, AI capability development, deployment, quality assurance, coaching and continuous workflow improvement." },
    { q: "Is this the same as hiring a virtual assistant?", a: "No. Lymora operators are selected for a defined role, trained in applied AI and responsible workflow operation, then supported through ongoing quality and capability reviews." },
    { q: "Does AI replace the professional?", a: "No. Lymora uses a human-in-the-loop model: people define intent, AI supports controlled execution, and qualified humans verify material outputs." },
    { q: "What is included in the monthly service?", a: "The service can include recruitment, capability development, role-specific onboarding, prompt and SOP libraries, coaching, performance review, quality assurance and workflow recommendations." }
  ];
  const path = "/ai-workforce";
  return <>
    <JsonLd data={[
      serviceSchema({ name: "Lymora AI Workforce", description: "Managed AI-enabled professionals recruited, trained, certified, deployed and supported for UAE organisations.", path, audience: "SMEs and enterprise teams in the UAE", offers: operatorRoles.map(role => role.name) }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "AI Workforce", path }]),
      faqSchema(faqs)
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "AI Workforce" }]}/><span className="eyebrow">Lymora Workforce</span><h1>The next hire should multiply the team around them.</h1><p>Deploy trained, certified and managed professionals who use AI to increase operating capacity without removing human accountability.</p><div className="hero-actions"><Link href="/contact" className="button">Design the first role</Link></div></div></section>

    <section><div className="container"><SectionHeading eyebrow="AI Workforce as a Service" title="More than placement. More than software." text="Traditional recruitment finds a person. Software vendors provide a tool. Lymora combines role design, capable talent, responsible workflow standards and ongoing operational support."/><div className="cards-3">{[
      ["01", "Recruit", "Source suitable professionals and assess baseline capability, role fit and communication standards."],
      ["02", "Train and certify", "Build applied AI, workflow design and responsible-use capability through CAIO™ or equivalent development."],
      ["03", "Deploy", "Onboard the operator into client systems, context, SOPs, review rules and success measures."],
      ["04", "Manage and improve", "Provide coaching, quality assurance, performance review and continuous workflow improvement."]
    ].map(([n,t,d])=><div className="card" key={t}><span className="card-number">{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>

    <section className="dark-section"><div className="container"><SectionHeading eyebrow="AI operator roles" title="Choose the capability your team needs." text="Each role is configured around the client environment, defined responsibilities, approved systems, human decisions and measurable outputs."/><div className="solution-grid">{operatorRoles.map((role, index)=><Link className="solution-card" href={`/ai-workforce/${role.slug}`} key={role.slug}><span className="eyebrow">AI operator {String(index + 1).padStart(2,"0")}</span><h3>{role.name}</h3><p>{role.summary}</p><span className="text-link light">Explore the role →</span></Link>)}</div></div></section>

    <section><div className="container split"><div><SectionHeading eyebrow="What the subscription includes" title="A managed productivity service, not cheap labour." text="The commercial model includes the capability and controls required to make an AI-enabled role reliable over time."/></div><div className="check-list">{["Recruitment and selection", "CAIO™ or equivalent capability development", "Role-specific workflow onboarding", "Client prompt, context and SOP library", "Monthly coaching and upskilling", "Performance review and quality assurance", "Workflow improvement recommendations", "Replacement support subject to contract"].map(item=><div key={item}><i>✓</i><p>{item}</p></div>)}</div></div></section>

    <section className="muted-section"><div className="container"><SectionHeading eyebrow="Frequently asked questions" title="Understanding the managed workforce model."/><FAQ items={faqs}/></div></section>
    <CTA title="Do not hire for yesterday’s way of working." text="Start with the work, required human judgement and measurable outcome. Lymora will determine whether training, implementation or managed deployment is the right next step." primary="Define the first role" />
  </>;
}
