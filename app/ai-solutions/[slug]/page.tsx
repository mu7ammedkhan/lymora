import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, CTA, FAQ, SectionHeading } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { aiSolutions } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return aiSolutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = aiSolutions.find((item) => item.slug === slug);
  if (!solution) return {};
  return pageMetadata({
    title: solution.name,
    description: solution.summary,
    path: `/ai-solutions/${solution.slug}`,
    keywords: solution.searchIntent.split(",").map(item => item.trim())
  });
}

export default async function AISolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = aiSolutions.find((item) => item.slug === slug);
  if (!solution) notFound();
  const path = `/ai-solutions/${solution.slug}`;
  const faqItems = solution.faqs.map(([q, a]) => ({ q, a }));

  return (
    <>
      <JsonLd data={[
        serviceSchema({ name: solution.name, description: solution.summary, path, audience: solution.audience, offers: [...solution.services] }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "AI Solutions", path: "/ai-solutions" }, { name: solution.name, path }]),
        faqSchema(faqItems)
      ]} />
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "AI Solutions", href: "/ai-solutions" },
              { label: solution.name }
            ]}
          />
          <span className="eyebrow">{solution.searchIntent}</span>
          <h1>{solution.headline}</h1>
          <p>{solution.summary}</p>
          <div className="hero-actions">
            <Link className="button" href="/contact">Discuss this solution</Link>
            <Link className="text-link light" href="/academy">Explore training →</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container content-grid">
          <article className="prose">
            <div className="answer-block">
              <strong>Best fit:</strong> {solution.audience}
            </div>
            <h2>What this solution helps you achieve</h2>
            <p>
              {solution.name} should create usable capability, not another disconnected initiative.
              Lymora starts by clarifying the work, the people responsible for it, the risks involved
              and the measurable outcome the organisation wants to improve.
            </p>

            <h2>Expected outcomes</h2>
            <ul>
              {solution.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>

            <h2>Relevant Lymora services</h2>
            <div className="mini-card-grid">
              {solution.services.map((service) => (
                <div className="mini-card" key={service}>
                  <h3>{service}</h3>
                  <p>Designed around your team, workflow maturity and responsible AI requirements.</p>
                </div>
              ))}
            </div>

            <h2>How to start</h2>
            <ol>
              <li>Choose the team or workflow where AI could create a visible improvement.</li>
              <li>Define the current baseline for time, quality, response speed or consistency.</li>
              <li>Identify what humans must approve, verify or decide.</li>
              <li>Build the first controlled workflow before scaling to more teams.</li>
            </ol>

            <h2>The Lymora implementation method</h2>
            <p>Lymora uses a six-stage pathway drawn from its AI Workforce Framework™. The sequence keeps capability, value and risk connected throughout the engagement.</p>
            <div className="mini-card-grid">
              {["Diagnose readiness and risk", "Prioritise by value and feasibility", "Enable leaders and teams", "Implement and document workflows", "Deploy certified operators where needed", "Manage quality, adoption and improvement"].map((step, index) => (
                <div className="mini-card" key={step}><span className="card-number">{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3></div>
              ))}
            </div>
            <p><Link className="text-link" href="/methodologies">Explore Lymora methodologies →</Link></p>
          </article>

          <aside className="sidebar">
            <h3>Related AI pages</h3>
            {aiSolutions
              .filter((item) => item.slug !== solution.slug)
              .slice(0, 5)
              .map((item) => (
                <Link href={`/ai-solutions/${item.slug}`} key={item.slug}>{item.name}</Link>
              ))}
          </aside>
        </div>
      </section>

      <section className="muted-section">
        <div className="container">
          <SectionHeading eyebrow="Frequently asked questions" title={`Questions about ${solution.name.toLowerCase()}.`} />
          <FAQ items={faqItems} />
        </div>
      </section>

      <CTA
        title={`Make ${solution.name.toLowerCase()} practical.`}
        text="Share your current team, tools and workflow priorities. Lymora will help choose the clearest adoption path."
        primary="Book a conversation"
        secondary="View all AI solutions"
        secondaryHref="/ai-solutions"
      />
    </>
  );
}
