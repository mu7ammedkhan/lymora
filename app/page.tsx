import Image from "next/image";
import Link from "next/link";
import { Button, CTA, Marquee, SplitText } from "@/components/UI";
import { HeroAI } from "@/components/HeroAI";
import { HeroVideo } from "@/components/HeroVideo";
import { IndustryShowcase } from "@/components/IndustryShowcase";
import { LymoraMark } from "@/components/Logo";
import { heroMedia, industryPhotos, photos } from "@/lib/media";
import { aiSolutions, industries, insights, operatorRoles } from "@/lib/site";

const engines = [
  {
    number: "01",
    name: "Academy",
    title: "Build people who know what good looks like.",
    text: "Applied certification and team enablement that turn AI from personal experimentation into professional capability.",
    points: ["CAIO™ certification", "Team AI enablement", "Leadership programmes"],
    href: "/academy",
    link: "Explore the Academy",
    photo: photos.workshop,
  },
  {
    number: "02",
    name: "Workforce",
    title: "Add capacity without losing accountability.",
    text: "Trained professionals who use AI inside clearly designed workflows, with ongoing support and human judgement built in.",
    points: ["Managed AI operators", "Role-specific workflows", "Quality assurance"],
    href: "/ai-workforce",
    link: "Explore the Workforce",
    photo: photos.teamCollab,
  },
  {
    number: "03",
    name: "Enterprise",
    title: "Redesign the work, not just the tool stack.",
    text: "Move from scattered pilots to an operating model for capability, workflows, governance and measurable improvement.",
    points: ["Readiness assessment", "Workflow redesign", "Responsible governance"],
    href: "/enterprise",
    link: "Explore Enterprise",
    photo: photos.meeting,
  },
] as const;

const steps = [
  { title: "Discover", text: "Find the work where intelligence can create meaningful advantage.", photo: photos.analyst },
  { title: "Design", text: "Define the workflow, the human role, the controls and the measures.", photo: photos.mentor },
  { title: "Enable", text: "Build practical capability through the work itself.", photo: photos.presentation },
  { title: "Operate", text: "Deploy, verify and improve the system over time.", photo: photos.operator },
] as const;

const thesis = "The advantage is no longer having access to AI. It is knowing how to direct it, verify it and redesign work around it.";

export default function HomePage() {
  const film = heroMedia.home;
  const thesisWords = thesis.split(" ");
  return (
    <>
      <section className="home-hero">
        <HeroAI />
        <div className="container home-hero-copy">
          <span className="pill" data-reveal="fade"><LymoraMark size={16} />AI Workforce Company · Dubai, UAE</span>
          <SplitText as="h1" text="The workforce for an *AI‑shaped world.*" />
          <p data-reveal="up" style={{ "--d": "300ms" } as React.CSSProperties}>Trained people, governed workflows and managed AI capacity for ambitious UAE teams.</p>
          <div className="hero-actions" data-reveal="up" style={{ "--d": "420ms" } as React.CSSProperties}>
            <Button href="/for-businesses">Build AI capability</Button>
            <Button href="/about" variant="ghost" icon="→">Discover Lymora</Button>
          </div>
        </div>
        <div className="home-film" data-scroll="view">
          <div className="home-film-frame">
            <HeroVideo src={film.video} mobileSrc={film.mobile} poster={film.poster} />
            <span className="home-film-caption"><LymoraMark size={18} />Human judgement. Intelligent execution.</span>
          </div>
        </div>
      </section>

      <Marquee items={["Applied AI certification", "Managed AI operators", "Workflow redesign", "Responsible AI governance", "Team enablement", "Readiness assessment", "Human-in-the-loop delivery"]} />

      <section className="home-statement" id="thesis">
        <div className="container home-statement-grid">
          <div>
            <span className="eyebrow" data-reveal="fade">Our point of view</span>
            <SplitText text="AI is everywhere. *Capability isn’t.*" />
          </div>
          <div>
            <p className="scroll-words" data-scroll="view" style={{ "--n": thesisWords.length } as React.CSSProperties}>
              <span className="sr-only">{thesis}</span>
              <span aria-hidden="true">{thesisWords.map((word, index) => <span key={index} style={{ "--i": index } as React.CSSProperties}>{word} </span>)}</span>
            </p>
            <p className="home-statement-note" data-reveal="up">Lymora trains the people, structures the workflows and manages the operating layer that makes AI useful in the real world.</p>
          </div>
        </div>
      </section>

      <section className="home-engines">
        <div className="container">
          <div className="home-head">
            <span className="eyebrow" data-reveal="fade">One operating system</span>
            <SplitText text="One system. *Three ways to move.*" />
            <p data-reveal="up">Start with capability, capacity or transformation. Every path follows the same standard: human intent, intelligent execution and verified outcomes.</p>
          </div>
          <div className="stack">
            {engines.map((engine, index) => (
              <article className={`stack-card stack-card-${index + 1}`} key={engine.name} style={{ "--i": index } as React.CSSProperties}>
                <div className="stack-copy">
                  <span className="stack-label"><b>{engine.number}</b>{engine.name}</span>
                  <h3>{engine.title}</h3>
                  <p>{engine.text}</p>
                  <ul>{engine.points.map(point => <li key={point}>{point}</li>)}</ul>
                  <Button href={engine.href} variant={index === 2 ? "light" : "primary"}>{engine.link}</Button>
                </div>
                <div className="stack-media">
                  <Image src={engine.photo.src} alt={engine.photo.alt} fill sizes="(max-width: 980px) 100vw, 55vw" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="container">
          <div className="home-head home-head-split">
            <div>
              <span className="eyebrow" data-reveal="fade">The CAIO™ standard</span>
              <SplitText text="A standard built to *mean something.*" />
            </div>
            <Link className="text-link" href="/caio" data-reveal="fade">About CAIO™ certification <span>→</span></Link>
          </div>
          <div className="stat-row">
            {[
              { value: 36, suffix: "h", label: "of applied learning, built around real workplace tasks" },
              { value: 75, suffix: "%", label: "minimum standard to certify. No attendance badges." },
              { value: 2, suffix: " yrs", label: "credential validity, renewed through development" },
              { value: operatorRoles.length, suffix: "", label: "AI operator roles ready to configure for your team" },
            ].map((stat, index) => (
              <div className="stat-cell" key={stat.label} data-reveal="up" style={{ "--i": index } as React.CSSProperties}>
                <strong><span data-count={stat.value}>{stat.value}</span>{stat.suffix}</strong>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-process" data-scroll="view">
        <div className="container">
          <div className="home-head home-head-split">
            <div>
              <span className="eyebrow" data-reveal="fade">How Lymora works</span>
              <SplitText text="From potential to *performance.*" />
            </div>
            <p data-reveal="up">We make the change visible, controlled and repeatable from the first workflow onward.</p>
          </div>
          <div className="process-track" aria-hidden="true"><span /></div>
          <ol className="process-steps">
            {steps.map((step, index) => (
              <li key={step.title} data-reveal="up" style={{ "--i": index } as React.CSSProperties}>
                <span className="process-dot">{String(index + 1).padStart(2, "0")}</span>
                <div className="process-photo"><Image src={step.photo.src} alt={step.photo.alt} fill sizes="(max-width: 980px) 90vw, 25vw" /></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/methodologies" className="text-link light" data-reveal="fade">See the operating methods <span>→</span></Link>
        </div>
      </section>

      <section className="home-bento">
        <div className="container">
          <div className="home-head home-head-center">
            <span className="eyebrow" data-reveal="fade">Human meets intelligence</span>
            <SplitText text="People stay in charge. *AI does more.*" />
          </div>
          <div className="bento">
            <figure className="bento-tile bento-a" data-reveal="up">
              <Image src={photos.teamCollab.src} alt={photos.teamCollab.alt} fill sizes="(max-width: 980px) 100vw, 50vw" />
              <figcaption><b>Human judgement</b>Material decisions stay with accountable people.</figcaption>
            </figure>
            <div className="bento-tile bento-b bento-flow" data-reveal="up" style={{ "--i": 1 } as React.CSSProperties}>
              <span>HITL Workflow Model™</span>
              <ol>
                <li><i>01</i>Human intent</li>
                <li><i>02</i>AI-supported execution</li>
                <li><i>03</i>Human verification</li>
                <li><i>04</i>Recorded outcome</li>
              </ol>
            </div>
            <figure className="bento-tile bento-c" data-reveal="up" style={{ "--i": 2 } as React.CSSProperties}>
              <Image src={photos.graduate.src} alt={photos.graduate.alt} fill sizes="(max-width: 980px) 100vw, 25vw" />
              <figcaption><b>Certified</b>Evidence, not attendance.</figcaption>
            </figure>
            <div className="bento-tile bento-d bento-quote" data-reveal="up" style={{ "--i": 3 } as React.CSSProperties}>
              <LymoraMark size={28} />
              <p>“Businesses do not need more AI tools. They need people and workflows that know how to use them.”</p>
              <span>The Lymora thesis</span>
            </div>
            <figure className="bento-tile bento-e" data-reveal="up" style={{ "--i": 4 } as React.CSSProperties}>
              <Image src={photos.dubaiArchitecture.src} alt={photos.dubaiArchitecture.alt} fill sizes="(max-width: 980px) 100vw, 25vw" />
              <figcaption><b>Built in Dubai</b>For UAE and GCC organisations.</figcaption>
            </figure>
            <figure className="bento-tile bento-f" data-reveal="up" style={{ "--i": 5 } as React.CSSProperties}>
              <Image src={photos.operator.src} alt={photos.operator.alt} fill sizes="(max-width: 980px) 100vw, 25vw" />
              <figcaption><b>Managed operators</b>Coached, reviewed, improving.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="home-outcomes">
        <div className="container">
          <div className="home-head home-head-split">
            <div>
              <span className="eyebrow" data-reveal="fade">Solutions</span>
              <SplitText text="Start with the *outcome.*" />
            </div>
            <Link href="/ai-solutions" className="text-link" data-reveal="fade">View every solution <span>→</span></Link>
          </div>
          <div className="outcome-grid">
            {aiSolutions.slice(0, 6).map((solution, index) => (
              <Link href={`/ai-solutions/${solution.slug}`} className="outcome-card" key={solution.slug} data-reveal="up" style={{ "--i": index } as React.CSSProperties}>
                <span className="outcome-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="outcome-arrow" aria-hidden="true">↗</span>
                <strong>{solution.name}</strong>
                <p>{solution.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-industries" id="industries">
        <div className="container">
          <div className="home-head home-head-split">
            <div>
              <span className="eyebrow" data-reveal="fade">Industries</span>
              <SplitText text="Context changes *everything.*" />
            </div>
            <p data-reveal="up">Lymora adapts capability, controls and workflows to the environment where they must perform.</p>
          </div>
          <IndustryShowcase items={industries.map(industry => ({ href: `/industries/${industry.slug}`, title: industry.name, text: industry.summary, image: industryPhotos[industry.slug] }))} />
        </div>
      </section>

      <section className="home-journal">
        <div className="container">
          <div className="home-head home-head-split">
            <div>
              <span className="eyebrow" data-reveal="fade">Insights</span>
              <SplitText text="Thinking for the *work ahead.*" />
            </div>
            <Link href="/insights" className="text-link" data-reveal="fade">All insights <span>→</span></Link>
          </div>
          <div className="journal-grid">
            {insights.map((article, index) => (
              <Link href={`/insights/${article.slug}`} className="journal-card" key={article.slug} data-reveal="up" style={{ "--i": index } as React.CSSProperties}>
                <div className="journal-visual">
                  <Image src={[photos.teamCollab, photos.workshop, photos.handsLaptop][index].src} alt="" fill sizes="(max-width: 980px) 100vw, 33vw" />
                </div>
                <small>{article.category} · {article.readingTime} read</small>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA title="Build the workforce your AI strategy is waiting for." text="Begin with one valuable workflow, one capable team or one clearly defined role." primary="Start the conversation" secondary="Explore all solutions" secondaryHref="/ai-solutions" />
    </>
  );
}
