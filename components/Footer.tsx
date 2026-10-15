import Image from "next/image";
import Link from "next/link";
import { aiSolutions, industries, siteConfig } from "@/lib/site";
import { LymoraMark, Wordmark } from "@/components/Logo";
import { BackToTop, DubaiClock } from "@/components/FooterWidgets";

const columns = [
  { title: "Build capability", links: [["Academy", "/academy"], ["CAIO™ Certification", "/caio"], ["Team AI Enablement", "/academy/team-ai-enablement"], ["For Professionals", "/for-professionals"]] },
  { title: "Build capacity", links: [["AI Workforce", "/ai-workforce"], ["For Business", "/for-businesses"], ...aiSolutions.slice(0, 3).map(item => [item.name.replace(" in Dubai", ""), `/ai-solutions/${item.slug}`])] },
  { title: "Transform work", links: [["Enterprise", "/enterprise"], ["AI Readiness", "/enterprise/ai-readiness-assessment"], ["AI Transformation", "/enterprise/ai-transformation"], ...industries.slice(0, 2).map(item => [item.name, `/industries/${item.slug}`])] },
  { title: "Company", links: [["About", "/about"], ["Methodologies", "/methodologies"], ["Insights", "/insights"], ["Contact", "/contact"]] },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <section className="footer-panel" aria-label="Lymora in Dubai">
          <Image src="/images/dubai-skyline.webp" alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="footer-panel-photo" />
          <span className="footer-panel-tint" aria-hidden="true" />
          <span className="footer-horizon" aria-hidden="true" />
          <div className="footer-panel-top">
            <div data-reveal="up">
              <span className="eyebrow">Lymora · Dubai, UAE</span>
              <h2>Human meets <em>intelligence.</em></h2>
              <p>Building AI-ready professionals, teams and workforces for organisations across the UAE and GCC.</p>
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
          <div className="footer-chips" data-reveal="up">
            <a className="footer-chip" href={`mailto:${siteConfig.email}`}><small>Email</small><b>{siteConfig.email}</b></a>
            <div className="footer-chip"><small>Local time in Dubai</small><b><i className="footer-live" /><DubaiClock /> GST</b></div>
            <div className="footer-chip"><small>Head office</small><b>{siteConfig.location}</b></div>
          </div>
        </section>

        <div className="footer-links">
          <div className="footer-brand">
            <Wordmark inverse />
            <p>{siteConfig.description}</p>
            <div className="footer-social">
              <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          {columns.map(column => (
            <nav key={column.title} aria-label={column.title}>
              <h3>{column.title}</h3>
              {column.links.map(([label, href]) => <Link key={href} href={href}><span>{label}</span><i aria-hidden="true">→</i></Link>)}
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.legalName}</span>
          <span className="footer-legal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
