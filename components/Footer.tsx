import Link from "next/link";
import { aiSolutions, industries, siteConfig } from "@/lib/site";
import { LymoraMark, Wordmark } from "@/components/Logo";

/* Small shooting stars that fall around the giant wordmark: [start x, delay s, duration s, tail length] */
const meteors = [
  [140, 0, 3.2, 46], [320, 1.4, 2.6, 34], [520, 2.6, 3.4, 52], [700, 0.7, 2.9, 40],
  [880, 1.9, 2.5, 30], [1060, 3.1, 3.1, 48], [1240, 0.3, 2.8, 38], [420, 3.8, 3, 44],
  [960, 4.4, 2.7, 36], [620, 5.1, 3.3, 50], [1160, 5.8, 2.6, 32], [240, 6.3, 3.1, 42],
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
        <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid meet">
          <defs>
            <text id="footer-word" x="600" y="226" textAnchor="middle" textLength="620" lengthAdjust="spacingAndGlyphs" className="footer-giant-text">lymora</text>
            <mask id="footer-sky" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="320">
              <rect width="1200" height="320" fill="#fff" />
              <use href="#footer-word" fill="#000" stroke="#000" strokeWidth="10" strokeLinejoin="round" />
            </mask>
            <linearGradient id="footer-word-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".34" />
              <stop offset="1" stopColor="#fff" stopOpacity=".06" />
            </linearGradient>
            <radialGradient id="footer-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#2A5C9F" stopOpacity=".42" />
              <stop offset="1" stopColor="#2A5C9F" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="meteor-tail" x1="-56" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#9DB8E0" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity=".85" />
            </linearGradient>
          </defs>
          <ellipse cx="600" cy="176" rx="430" ry="110" fill="url(#footer-glow)" />
          <g mask="url(#footer-sky)">
            {meteors.map(([x, delay, duration, length], index) => (
              <g className="meteor" key={index} style={{ "--x": `${x}px`, "--delay": `${delay}s`, "--duration": `${duration}s` } as React.CSSProperties}>
                <line x1={-length} y1="0" x2="0" y2="0" stroke="url(#meteor-tail)" strokeWidth="1.3" strokeLinecap="round" />
                <circle r="1.6" fill="#fff" />
              </g>
            ))}
          </g>
          <use href="#footer-word" fill="url(#footer-word-fill)" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
        </svg>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.legalName}</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div>
    </footer>
  );
}
