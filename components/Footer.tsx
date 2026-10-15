import Link from "next/link";
import { aiSolutions, industries, siteConfig } from "@/lib/site";
import { LymoraMark, Wordmark } from "@/components/Logo";
import { BackToTop, DubaiClock } from "@/components/FooterWidgets";
import { FooterWave } from "@/components/FooterWave";

const columns = [
  { title: "Build capability", links: [["Academy", "/academy"], ["CAIO™ Certification", "/caio"], ["Team AI Enablement", "/academy/team-ai-enablement"], ["For Professionals", "/for-professionals"]] },
  { title: "Build capacity", links: [["AI Workforce", "/ai-workforce"], ["For Business", "/for-businesses"], ...aiSolutions.slice(0, 3).map(item => [item.name.replace(" in Dubai", ""), `/ai-solutions/${item.slug}`])] },
  { title: "Transform work", links: [["Enterprise", "/enterprise"], ["AI Readiness", "/enterprise/ai-readiness-assessment"], ["AI Transformation", "/enterprise/ai-transformation"], ...industries.slice(0, 2).map(item => [item.name, `/industries/${item.slug}`])] },
  { title: "Company", links: [["About", "/about"], ["Methodologies", "/methodologies"], ["Insights", "/insights"], ["Contact", "/contact"]] },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-head">
        <div className="footer-head-copy" data-reveal="up">
          <span className="eyebrow">Start a conversation</span>
          <h2>Let’s build your <em>AI‑ready workforce.</em></h2>
          <a className="footer-email" href={`mailto:${siteConfig.email}`}>
            <span>{siteConfig.email}</span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
        <Link className="footer-cta" href="/contact" data-magnetic="0.2">
          <svg className="footer-cta-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="footer-cta-circle" d="M100 100 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0" /></defs>
            <text><textPath href="#footer-cta-circle" textLength="500">Start the conversation · Start the conversation · </textPath></text>
          </svg>
          <span className="footer-cta-core" aria-hidden="true">
            <LymoraMark size={34} />
            <i>↗</i>
          </span>
          <span className="sr-only">Start the conversation</span>
        </Link>
      </div>

      <div className="container footer-links">
        <div className="footer-brand">
          <Wordmark inverse />
          <p>{siteConfig.description}</p>
          <div className="footer-meta">
            <span><i className="footer-live" />Dubai · <DubaiClock /> GST</span>
            <span>{siteConfig.location}</span>
          </div>
        </div>
        {columns.map(column => (
          <nav key={column.title} aria-label={column.title}>
            <h3>{column.title}</h3>
            {column.links.map(([label, href]) => <Link key={href} href={href}><span>{label}</span><i aria-hidden="true">→</i></Link>)}
          </nav>
        ))}
      </div>

      <div className="footer-stage">
        <FooterWave />
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.legalName}</span>
          <span className="footer-legal">
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
