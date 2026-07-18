import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Certification and Career Capability for Professionals",
  description: "Build applied AI, workflow and responsible automation capability through Lymora Academy and CAIO™.",
  path: "/for-professionals"
});

export default function ProfessionalsPage() {
  return <>
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={[{label:"Home",href:"/"},{label:"For Professionals"}]}/>
      <span className="eyebrow">For professionals and jobseekers</span>
      <h1>Become impossible to overlook in the AI-enabled workplace.</h1>
      <p>Move beyond basic prompting. Build evidence that you can design workflows, verify outputs, manage risk and create measurable improvement.</p>
      <div className="hero-actions"><Link href="/caio" className="button">Build the capability</Link></div>
    </div></section>
    <section><div className="container">
      <SectionHeading eyebrow="Professional value" title="Capability employers can observe." text="The strongest signal is not that you completed a course. It is that you can improve real work responsibly."/>
      <div className="cards-3">
        {[ ["01","Practical portfolio","Produce role-based outputs, workflow maps, risk assessments and an implementation plan."], ["02","Assessed credential","Demonstrate capability through examinations, practical evidence and a live professional review."], ["03","Workforce pathway","Strong graduates may become relevant to future Lymora operator opportunities, subject to role fit and selection."] ].map(([number,title,text]) => <div className="card" key={title}><span className="card-number">{number}</span><h3>{title}</h3><p>{text}</p></div>)}
      </div>
    </div></section>
    <CTA title="The future will reward people who can direct intelligence well." text="Review the CAIO™ certification structure, professional standard and admissions requirements." primary="Explore CAIO™" primaryHref="/caio" />
  </>;
}
