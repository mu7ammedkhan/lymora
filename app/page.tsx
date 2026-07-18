import Image from "next/image";
import Link from "next/link";
import { CTA } from "@/components/UI";
import { aiSolutions, industries, insights } from "@/lib/site";

const chapters = [
  {
    number: "01",
    name: "Academy",
    title: "Build people who know what good looks like.",
    text: "Applied certification and team enablement that turn AI from personal experimentation into professional capability.",
    href: "/academy",
    link: "Explore Lymora Academy",
    image: "/lymora-capability-journey-v1.webp",
    alt: "A sequence of sculptural forms representing the journey from learning to certified capability",
    tone: "light",
  },
  {
    number: "02",
    name: "Workforce",
    title: "Add capacity without losing accountability.",
    text: "Deploy trained professionals who use AI inside clearly designed workflows, with ongoing support and human judgement built in.",
    href: "/ai-workforce",
    link: "Explore Lymora Workforce",
    image: "/lymora-operating-field-v1.webp",
    alt: "A field of paired sculptural forms connected by a precise line of light",
    tone: "dark",
  },
  {
    number: "03",
    name: "Enterprise",
    title: "Redesign the work, not just the tool stack.",
    text: "Move from scattered pilots to an operating model for capability, workflows, governance and measurable improvement.",
    href: "/enterprise",
    link: "Explore Lymora Enterprise",
    image: "/lymora-aperture-hero-v1.webp",
    alt: "Pearl and crystal sculptural forms meeting in a luminous aperture",
    tone: "ink",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="v5-hero">
        <Image
          src="/lymora-aperture-hero-v1.webp"
          alt="Pearl and crystal sculptural forms meeting to represent human and artificial intelligence"
          fill
          priority
          loading="eager"
          unoptimized
          sizes="100vw"
          className="v5-hero-art"
        />
        <div className="v5-hero-shade" />
        <div className="container v5-hero-inner">
          <div className="v5-hero-copy">
            <h1>The workforce for{" "}<br/><em>an AI-shaped world.</em></h1>
            <p>Build the people, workflows and operating discipline that turn artificial intelligence into business performance.</p>
            <div className="hero-actions">
              <Link href="/for-businesses" className="button">Build AI capability <span>↗</span></Link>
              <Link href="/about" className="bare-link">Discover Lymora <span>→</span></Link>
            </div>
          </div>
          <a className="v5-scroll-cue" href="#thesis" aria-label="Continue to the Lymora point of view"><span>↓</span></a>
        </div>
      </section>

      <section className="v5-thesis" id="thesis">
        <div className="container v5-thesis-grid">
          <h2>AI is everywhere.<br/><em>Capability isn’t.</em></h2>
          <div>
            <p className="v5-lead">The advantage is no longer having access to AI. It is knowing how to direct it, verify it and redesign work around it.</p>
            <p>Lymora trains the people, structures the workflows and manages the operating layer that makes AI useful in the real world.</p>
          </div>
        </div>
      </section>

      <section className="v5-system">
        <div className="container v5-system-head">
          <h2>One system.<br/>Three ways to move.</h2>
          <p>Start with capability, capacity or transformation. Every path follows the same standard: human intent, intelligent execution and verified outcomes.</p>
        </div>
        <div className="v5-chapters">
          {chapters.map((chapter, index) => (
            <article className={`v5-chapter v5-chapter-${chapter.tone}`} key={chapter.name}>
              <div className="v5-chapter-visual">
                <Image src={chapter.image} alt={chapter.alt} fill unoptimized sizes="(max-width: 820px) 100vw, 56vw" />
              </div>
              <div className="v5-chapter-copy">
                <div className="v5-chapter-title"><span>{chapter.number}</span><strong>{chapter.name}</strong></div>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
                <Link href={chapter.href}>{chapter.link} <span>↗</span></Link>
              </div>
              <span className="v5-chapter-count">0{index + 1}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="v5-process">
        <div className="container v5-process-grid">
          <div className="v5-process-intro">
            <h2>From potential<br/>to performance.</h2>
            <p>We make the change visible, controlled and repeatable from the first workflow onward.</p>
            <Link href="/methodologies" className="bare-link">See the operating methods <span>→</span></Link>
          </div>
          <div className="v5-process-steps">
            {[
              ["Discover", "Find the work where intelligence can create meaningful advantage."],
              ["Design", "Define the workflow, human role, controls and success measures."],
              ["Enable", "Build practical capability through the work itself."],
              ["Operate", "Deploy, verify and improve the system over time."],
            ].map(([title, text], index) => (
              <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="v5-outcomes">
        <div className="container">
          <div className="v5-outcomes-head"><h2>Start with the outcome.</h2><Link href="/ai-solutions">View every solution <span>↗</span></Link></div>
          <div className="v5-outcome-list">
            {aiSolutions.slice(0, 6).map((solution, index) => (
              <Link href={`/ai-solutions/${solution.slug}`} key={solution.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{solution.name}</strong>
                <p>{solution.summary}</p>
                <i>↗</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="v5-proof">
        <div className="container v5-proof-grid">
          <h2>A standard built to mean something.</h2>
          <div className="v5-proof-stats">
            <div><strong>36</strong><span>hours of applied CAIO™ learning</span></div>
            <div><strong>75%</strong><span>minimum certification standard</span></div>
            <div><strong>2</strong><span>year credential validity</span></div>
          </div>
        </div>
      </section>

      <section className="v5-industries">
        <div className="container v5-industries-grid">
          <div><h2>Context changes everything.</h2><p>Lymora adapts capability, controls and workflows to the environment where they must perform.</p></div>
          <div className="v5-industry-links">
            {industries.map((industry) => <Link href={`/industries/${industry.slug}`} key={industry.slug}>{industry.name}<span>↗</span></Link>)}
          </div>
        </div>
      </section>

      <section className="v5-journal">
        <div className="container">
          <div className="v5-journal-head"><h2>Thinking for the work ahead.</h2><Link href="/insights">All insights <span>↗</span></Link></div>
          <div className="v5-journal-grid">
            {insights.map((article, index) => (
              <Link href={`/insights/${article.slug}`} className={`v5-story v5-story-${index + 1}`} key={article.slug}>
                <div className="v5-story-visual"><Image src={chapters[index].image} alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /></div>
                <h3>{article.title}</h3><p>{article.description}</p><span>Read insight ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA title="Build the workforce your AI strategy is waiting for." text="Begin with one valuable workflow, one capable team or one clearly defined role." primary="Start the conversation" secondary="Explore all solutions" secondaryHref="/ai-solutions" />
    </>
  );
}
