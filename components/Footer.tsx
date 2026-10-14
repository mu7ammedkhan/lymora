import Link from "next/link";
import { aiSolutions, industries, siteConfig } from "@/lib/site";
import { LymoraMark, Wordmark } from "@/components/Logo";

/* Shooting stars that stream through the giant wordmark: [start x, delay s, duration s, length] */
const meteors = [
  [180, 0, 3.2, 150], [420, 1.1, 2.7, 120], [640, 2, 3.4, 170], [860, 0.5, 2.9, 130],
  [1060, 1.7, 2.5, 110], [300, 2.7, 3.6, 160], [760, 3.2, 2.8, 140], [980, 3.9, 3.1, 150],
  [520, 4.6, 2.6, 120], [1180, 5.2, 3, 140],
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-lead">
        <div className="footer-lead-copy" data-reveal="up">
          <span className="eyebrow">AI Workforce Company · Dubai</span>
          <h2>Human meets <em>intelligence.</em></h2>
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
      <div className="footer-giant" aria-hidden="true">
        <svg viewBox="0 0 1200 330" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="footer-word">
              <text x="600" y="238" textAnchor="middle" textLength="1140" lengthAdjust="spacingAndGlyphs" className="footer-giant-text">lymora</text>
            </clipPath>
            <linearGradient id="footer-word-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".16" />
              <stop offset="1" stopColor="#fff" stopOpacity=".03" />
            </linearGradient>
            <linearGradient id="meteor-tail" x1="-170" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#9DB8E0" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity=".95" />
            </linearGradient>
          </defs>
          <g clipPath="url(#footer-word)">
            <rect width="1200" height="330" fill="url(#footer-word-fill)" />
            {meteors.map(([x, delay, duration, length], index) => (
              <g className="meteor" key={index} style={{ "--x": `${x}px`, "--delay": `${delay}s`, "--duration": `${duration}s` } as React.CSSProperties}>
                <line x1={-length} y1="0" x2="0" y2="0" stroke="url(#meteor-tail)" strokeWidth="4" strokeLinecap="round" />
                <circle r="4.5" fill="#fff" />
                <circle r="11" fill="#fff" opacity=".18" />
              </g>
            ))}
          </g>
        </svg>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.legalName}</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div>
    </footer>
  );
}
