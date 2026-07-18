import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { operatorRoles } from "@/lib/site";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export function generateStaticParams() { return operatorRoles.map(role => ({ slug: role.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = operatorRoles.find(item => item.slug === slug);
  if (!role) return {};
  return pageMetadata({ title: `${role.name} Services UAE`, description: role.summary, path: `/ai-workforce/${role.slug}`, keywords: [role.name, `${role.name} UAE`, `${role.name} Dubai`, "AI workforce services"] });
}

export default async function OperatorRolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = operatorRoles.find(item => item.slug === slug);
  if (!role) notFound();
  const path = `/ai-workforce/${role.slug}`;
  return <>
    <JsonLd data={[
      serviceSchema({ name: `${role.name} Services`, description: role.summary, path, audience: "Businesses in the UAE", offers: [...role.workflows] }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "AI Workforce", path: "/ai-workforce" }, { name: role.name, path }])
    ]}/>
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "AI Workforce", href: "/ai-workforce" }, { label: role.name }]}/><span className="eyebrow">Managed AI workforce role</span><h1>{role.headline}</h1><p>{role.summary}</p><div className="hero-actions"><Link className="button" href="/contact">Discuss this role</Link></div></div></section>
    <section><div className="container content-grid"><article className="prose"><div className="answer-block"><strong>{role.name}:</strong> a trained professional using AI inside documented workflows, with human accountability for material decisions and outputs.</div><h2>Typical responsibilities</h2><ul>{role.responsibilities.map(item=><li key={item}>{item}</li>)}</ul><h2>Example AI-enabled workflows</h2><div className="mini-card-grid">{role.workflows.map((workflow,index)=><div className="mini-card" key={workflow}><span className="card-number">{String(index+1).padStart(2,"0")}</span><h3>{workflow}</h3><p>Configured around approved information, review criteria, escalation rules and measurable output standards.</p></div>)}</div><h2>How Lymora deploys the role</h2><ol><li>Define responsibilities, systems, risks and performance measures.</li><li>Select and assess a suitable professional.</li><li>Build applied AI and role-specific workflow capability.</li><li>Onboard the operator into client context, SOPs and controls.</li><li>Review quality, performance, wellbeing and workflow improvement.</li></ol><p><Link className="text-link" href="/methodologies">See the frameworks behind the deployment →</Link></p></article><aside className="sidebar"><h3>Other AI operator roles</h3>{operatorRoles.filter(item=>item.slug!==role.slug).map(item=><Link href={`/ai-workforce/${item.slug}`} key={item.slug}>{item.name}</Link>)}</aside></div></section>
    <CTA title={`Explore a managed ${role.name.toLowerCase()}.`} text="Share the role, recurring work and current capacity gap. Lymora will recommend the right scope, onboarding and management model." />
  </>;
}
