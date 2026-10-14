import Link from "next/link";
import { aiSolutions, industries, siteConfig } from "@/lib/site";
import { LymoraMark, Wordmark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-lead">
        <div className="footer-lead-copy" data-reveal="up">
          <span className="eyebrow">AI Workforce Company · Dubai</span>
          <h2>Human meets <em>intelligence.</em></h2>
        </div>
        <Link className="footer-conversation" href="/contact" data-magnetic="0.18">
          <span className="footer-conversation-orbit" aria-hidden="true"><LymoraMark size={64} /></span>
          <span className="footer-conversation-label">Start the conversation</span>
          <span className="footer-conversation-arrow" aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Wordmark inverse />
          <p>{siteConfig.description}</p>
          <div className="footer-contact">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <span>{siteConfig.location}</span>
          </div>
        </div>
        <div><h3>Build capability</h3><Link href="/academy">Academy</Link><Link href="/caio">CAIO™ Certification</Link><Link href="/academy/team-ai-enablement">Team AI Enablement</Link><Link href="/for-professionals">For Professionals</Link></div>
        <div><h3>Build capacity</h3><Link href="/ai-workforce">AI Workforce</Link><Link href="/for-businesses">For Business</Link>{aiSolutions.slice(0,3).map(i => <Link key={i.slug} href={`/ai-solutions/${i.slug}`}>{i.name.replace(" in Dubai", "")}</Link>)}</div>
        <div><h3>Transform work</h3><Link href="/enterprise">Enterprise</Link><Link href="/enterprise/ai-readiness-assessment">AI Readiness</Link><Link href="/enterprise/ai-transformation">AI Transformation</Link>{industries.slice(0,2).map(i => <Link key={i.slug} href={`/industries/${i.slug}`}>{i.name}</Link>)}</div>
        <div><h3>Lymora</h3><Link href="/about">About</Link><Link href="/methodologies">Methodologies</Link><Link href="/insights">Insights</Link><Link href="/contact">Contact</Link><a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
      </div>
      <div className="footer-giant" aria-hidden="true" data-scroll="view"><span>lymora</span></div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.legalName}</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div>
    </footer>
  );
}
