import Link from "next/link";
import { aiSolutions, industries, siteConfig } from "@/lib/site";
import { Wordmark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-lead">
        <div>
          <Wordmark inverse />
          <h2>Human Meets<br/>Intelligence.</h2>
        </div>
        <Link className="footer-conversation" href="/contact">
          <span className="footer-conversation-label">Build what comes next</span>
          <span className="footer-conversation-arrow" aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="container footer-grid">
        <div><h3>Build capability</h3><Link href="/academy">Academy</Link><Link href="/caio">CAIO™ Certification</Link><Link href="/academy/team-ai-enablement">Team AI Enablement</Link><Link href="/for-professionals">For Professionals</Link></div>
        <div><h3>Build capacity</h3><Link href="/ai-workforce">AI Workforce</Link><Link href="/for-businesses">For Business</Link>{aiSolutions.slice(0,3).map(i => <Link key={i.slug} href={`/ai-solutions/${i.slug}`}>{i.name.replace(" in Dubai", "")}</Link>)}</div>
        <div><h3>Transform work</h3><Link href="/enterprise">Enterprise</Link><Link href="/enterprise/ai-readiness-assessment">AI Readiness</Link><Link href="/enterprise/ai-transformation">AI Transformation</Link>{industries.slice(0,2).map(i => <Link key={i.slug} href={`/industries/${i.slug}`}>{i.name}</Link>)}</div>
        <div><h3>Lymora</h3><Link href="/about">About</Link><Link href="/methodologies">Methodologies</Link><Link href="/insights">Insights</Link><Link href="/contact">Contact</Link></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div>
    </footer>
  );
}
