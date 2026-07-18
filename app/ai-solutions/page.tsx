import Link from "next/link";
import { Breadcrumbs, CTA, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { aiSolutions } from "@/lib/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Solutions for Business, Training and Workforce Transformation",
  description:
    "Explore Lymora AI consulting, training, automation, readiness assessment and AI workforce solutions for practical adoption in the UAE.",
  path: "/ai-solutions"
});

export default function AISolutionsPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "AI Solutions", path: "/ai-solutions" }]),
        { "@context": "https://schema.org", "@type": "ItemList", name: "Lymora AI Solutions", itemListElement: aiSolutions.map((solution,index)=>({ "@type":"ListItem", position:index+1, name:solution.name, url:`${process.env.NEXT_PUBLIC_SITE_URL || "https://lymoraops.com"}/ai-solutions/${solution.slug}` })) }
      ]}/>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "AI Solutions" }]} />
          <span className="eyebrow">AI Solutions</span>
          <h1>One clear next move for every AI ambition.</h1>
          <p>
            Move from search to action across AI strategy, workforce capability, workflow implementation,
            responsible governance and managed deployment.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading
            eyebrow="Search by need"
            title="Start with the constraint, not the technology."
            text="Each page is designed around a high-intent question, then connects the search to a practical Lymora service path."
          />
          <div className="solution-grid">
            {aiSolutions.map((solution) => (
              <Link className="solution-card" href={`/ai-solutions/${solution.slug}`} key={solution.slug}>
                <span className="eyebrow">{solution.searchIntent.split(",")[0]}</span>
                <h3>{solution.name}</h3>
                <p>{solution.summary}</p>
                <span className="text-link">Explore solution →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section">
        <div className="container split">
          <div>
            <SectionHeading
              eyebrow="How Lymora works"
              title="The same operating logic connects every solution."
              text="Start with the work, define the human role, apply AI where it improves execution, and verify the output before scaling."
            />
          </div>
          <div className="process-panel">
            {["Assess", "Design", "Train", "Deploy", "Improve"].map((step, index) => (
              <div key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="The right first move changes everything after it."
        text="Tell us what you are trying to improve. Lymora will recommend the best path across consulting, training, automation or workforce deployment."
        primary="Talk to Lymora"
        secondary="View AI Workforce"
        secondaryHref="/ai-workforce"
      />
    </>
  );
}
