import Link from "next/link";
import { CaioApplicationForm } from "@/components/CaioApplicationForm";
import { Breadcrumbs, FAQ } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, courseSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "CAIO™ AI Certification Dubai",
  description: "Apply for CAIO™, a selective five-week AI certification in Dubai covering responsible AI, workflow design, verification and automation.",
  path: "/caio",
  keywords: ["AI certification Dubai", "AI operator certification", "applied AI training UAE", "AI training for professionals Dubai", "responsible AI course UAE", "AI workflow training", "no-code AI automation course", "professional AI certification"],
});

const competencies = [
  ["Evaluate", "Select valuable, suitable and responsible AI use cases."],
  ["Instruct", "Create reliable context, instructions and review criteria."],
  ["Verify", "Check claims, sources, assumptions and output quality."],
  ["Produce", "Build professional workplace outputs people can use."],
  ["Redesign", "Map and improve recurring business workflows."],
  ["Automate", "Prototype controlled no-code AI-assisted systems."],
  ["Govern", "Classify risk, protect information and apply oversight."],
  ["Measure", "Establish baselines and demonstrate responsible value."],
] as const;

const weeks = [
  ["Week 1", "AI foundations and use-case selection", "Understand capabilities and limits, identify valuable work and choose the right level of human oversight."],
  ["Week 2", "Context design, prompting and verification", "Build better instructions, context systems, review criteria and evidence-based verification methods."],
  ["Week 3", "Professional outputs and workflow redesign", "Produce decision-ready work, map current processes and design improved human-led AI workflows."],
  ["Week 4", "Automation, responsible AI and risk controls", "Prototype no-code automation while protecting data, quality, accountability and escalation."],
  ["Week 5", "Value, adoption and capstone review", "Measure the improvement, plan implementation and defend a real workflow before a professional reviewer."],
] as const;

const faq = [
  { q: "Is CAIO™ suitable for beginners?", a: "Yes, when the applicant has professional experience and is ready for applied work. The programme does not assume advanced technical knowledge, but it does require consistent participation and assessment." },
  { q: "Do I need coding experience?", a: "No. CAIO™ focuses on workplace AI, workflow design and no-code automation. The emphasis is on reliable application, not software engineering." },
  { q: "How is the programme delivered?", a: "CAIO™ runs for five weeks through live instructor-led sessions, guided labs, independent portfolio work and a capstone review." },
  { q: "Is CAIO™ government-accredited?", a: "CAIO™ is a proprietary professional certification issued by Lymora Academy. It is not presented as government accreditation, academic credit or regulatory approval." },
  { q: "Does certification guarantee a job?", a: "No. Lymora does not guarantee employment, income or placement. High-performing graduates may be considered for future Lymora Operator Pool opportunities." },
  { q: "What happens if I do not pass an assessment?", a: "Reassessment options may be offered according to the assessment policy, the area requiring improvement and the candidate’s overall participation." },
  { q: "Can my employer sponsor me?", a: "Yes. Employers may sponsor an accepted applicant or discuss a private CAIO™ cohort for their team." },
  { q: "Which AI tools are used?", a: "The programme is vendor-neutral. Appropriate generative AI, research, productivity and no-code tools may be used to practise transferable operating methods." },
  { q: "Can employers verify the certificate?", a: "Successful candidates receive a numbered certificate, digital badge and competency transcript designed for verification against Lymora’s credential records." },
  { q: "How long is the credential valid?", a: "The CAIO™ credential is valid for two years, followed by a renewal pathway designed to keep professional capability current." },
];

export default function CaioLandingPage() {
  return (
    <>
      <JsonLd data={[courseSchema(), faqSchema(faq), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Academy", path: "/academy" }, { name: "CAIO™", path: "/caio" }])]} />

      <div className="caio-announcement">Founding Cohort Applications Open <span>•</span> 12 Seats <span>•</span> Selective Admission</div>

      <section className="caio-hero">
        <div className="container caio-hero-inner">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Academy", href: "/academy" }, { label: "CAIO™" }]} />
          <p className="caio-brand-label">Lymora Academy</p>
          <h1>Become a Certified{" "}<br/><em>AI Operator.</em></h1>
          <p className="caio-hero-lead">Become the professional who can turn AI into reliable, responsible and measurable business results.</p>
          <div className="hero-actions">
            <Link href="#application" className="button" data-event="caio_apply_hero">Apply for Eligibility <span>↗</span></Link>
            <Link href="#programme" className="bare-link">View the Programme <span>↓</span></Link>
          </div>
          <div className="caio-trust-line"><span>5 weeks</span><span>36 hours</span><span>Live and applied</span><span>Professional assessment</span></div>
          <p className="caio-eligibility-note">Applications are reviewed individually. Admission is not automatic.</p>
        </div>
      </section>

      <section className="caio-shift">
        <div className="container caio-shift-grid">
          <h2>AI tools are everywhere.<br/><em>Capable operators are not.</em></h2>
          <div>
            <p className="caio-answer">An AI Operator is a professional who applies AI to real business workflows under appropriate human oversight.</p>
            <p>Most people can use an AI tool. Far fewer can redesign work, verify outputs, protect information and create measurable business value. CAIO™ certifies the second group.</p>
          </div>
        </div>
      </section>

      <section className="caio-transformation">
        <div className="container">
          <div className="caio-section-head"><h2>Move from using AI<br/>to operating with it.</h2><p>CAIO™ changes the professional standard from isolated tool use to structured, verifiable workplace capability.</p></div>
          <div className="caio-before-after">
            <div><h3>Before</h3>{["Occasional AI use", "Disconnected prompts", "Inconsistent outputs", "No documented risk controls"].map(item => <p key={item}>{item}</p>)}</div>
            <div><h3>After</h3>{["Structured operator practice", "Repeatable workflows", "Verification methods", "Documented controls and implementation capability"].map(item => <p key={item}>{item}</p>)}</div>
          </div>
        </div>
      </section>

      <section className="caio-competencies">
        <div className="container">
          <div className="caio-section-head"><h2>Eight capabilities.<br/>One professional standard.</h2><p>Certification requires applied evidence across every domain, not passive attendance.</p></div>
          <div className="caio-competency-grid">{competencies.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="caio-inline-cta"><Link href="#application" className="button">Apply for Eligibility <span>↗</span></Link></div>
        </div>
      </section>

      <section className="caio-programme" id="programme">
        <div className="container caio-programme-grid">
          <div className="caio-programme-intro"><h2>Five weeks.<br/>Built around the work.</h2><p>36 hours of live instruction, guided labs and capstone development.</p></div>
          <div className="caio-week-list">{weeks.map(([week, title, text]) => <article key={week}><span>{week}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="caio-frameworks">
        <div className="container">
          <div className="caio-section-head"><h2>Methods you can use<br/>after the course ends.</h2><p>Three signature frameworks create a shared language for quality, oversight and responsible execution.</p></div>
          <div className="caio-framework-list">
            <article><strong>CLEAR™</strong><div><h3>Instruction Framework</h3><p>Context, limitations, expected outcome, audience and approach, and review criteria.</p></div></article>
            <article><strong>HITL™</strong><div><h3>Workflow Model</h3><p>Human intent, AI-supported execution, human verification, recorded outcome and continuous improvement.</p></div></article>
            <article><strong>Risk</strong><div><h3>Lymora AI Risk Classification</h3><p>Green, amber and red workflow classification with proportionate human controls.</p></div></article>
          </div>
        </div>
      </section>

      <section className="caio-outputs">
        <div className="container caio-outputs-grid">
          <div><h2>Leave with evidence,<br/>not notes.</h2><p>Every candidate develops a portfolio of practical work designed to demonstrate operating capability.</p></div>
          <ol>{["AI Use-Case Decision Canvas", "Reusable instruction system", "Verified business brief", "Role-based productivity portfolio", "Current and future workflow maps", "Workflow SOP", "No-code automation prototype", "Responsible-AI risk assessment", "30-day implementation plan", "Capstone presentation"].map(item => <li key={item}>{item}</li>)}</ol>
        </div>
      </section>

      <section className="caio-standard">
        <div className="container">
          <div className="caio-section-head"><h2>Attendance is not certification.</h2><p>The credential is earned through applied evidence, assessment and professional review.</p></div>
          <div className="caio-standard-grid">
            <div><strong>75%</strong><span>overall pass standard</span></div>
            <div><strong>Required</strong><span>responsible-AI threshold</span></div>
            <div><strong>Live</strong><span>professional capstone review</span></div>
            <div><strong>2 years</strong><span>credential validity</span></div>
          </div>
          <div className="caio-standard-detail"><p>Assessment includes a practical portfolio, supervised knowledge assessment, responsible-AI assessment, capstone project and live professional review.</p><Link href="#application" className="button">Apply for Eligibility <span>↗</span></Link></div>
        </div>
      </section>

      <section className="caio-fit">
        <div className="container caio-fit-grid">
          <div><h2>Who should apply.</h2><p>Career-focused professionals who are ready to build evidence of practical AI capability.</p><ul>{["Operations and administrative professionals", "Executive assistants and coordinators", "Marketing and content professionals", "Sales, research and business-development professionals", "HR, recruitment and customer-service professionals", "Freelancers, entrepreneurs and SME employees"].map(item => <li key={item}>{item}</li>)}</ul></div>
          <div><h2>Who should not.</h2><p>This is not designed as a passive or instant-access course.</p><ul>{["People seeking only recorded videos", "People unwilling to complete assignments", "People expecting guaranteed jobs", "People looking only for prompt lists", "People unable to attend the live programme"].map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="caio-offer">
        <div className="container caio-offer-grid">
          <div><h2>The founding cohort.</h2><p>Twelve selectively admitted professionals. The complete live programme, assessment and credential pathway.</p></div>
          <div className="caio-price"><span>Founding rate</span><strong>AED 2,250</strong><small>excluding VAT</small><p>Future standard programme value: <s>AED 3,950</s></p></div>
          <div className="caio-offer-facts"><p><strong>AED 500</strong> deposit after acceptance</p><p><strong>12</strong> maximum participants</p><p><strong>5 weeks</strong> live and applied</p><p>Payment-plan details are provided to accepted candidates.</p></div>
          <div className="caio-offer-action"><Link href="#application" className="button">Apply for Eligibility <span>↗</span></Link><p>Applying does not guarantee admission.</p></div>
        </div>
      </section>

      <section className="caio-admission">
        <div className="container">
          <div className="caio-section-head"><h2>Selective by design.</h2><p>The application helps Lymora protect cohort quality, participation and professional outcomes.</p></div>
          <div className="caio-admission-steps">{[["01", "Apply", "Complete the eligibility application."], ["02", "Review", "The Academy reviews experience, goals and fit."], ["03", "Screening call", "Shortlisted candidates may be invited to a brief call."], ["04", "Admission", "Accepted candidates secure their seat with an AED 500 deposit."]].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div>
      </section>

      <section className="caio-application" id="application">
        <div className="container caio-application-grid">
          <div><h2>Apply for eligibility.</h2><p>Tell us about your work, your current AI capability and what you intend to change. Applications are reviewed individually.</p><div className="caio-application-note"><strong>Before you apply</strong><p>Submitting an application does not guarantee acceptance. Shortlisted candidates may be invited to a screening call.</p></div></div>
          <CaioApplicationForm />
        </div>
      </section>

      <section className="caio-faq">
        <div className="container caio-faq-grid"><div><h2>Before you apply.</h2><p>Clear answers about the programme, standard and admission process.</p></div><FAQ items={faq} /></div>
      </section>

      <section className="caio-final">
        <div className="container"><h2>AI will change how work is done. Decide whether you will watch it happen or learn to operate it.</h2><Link href="#application" className="button">Apply for Eligibility <span>↗</span></Link><nav><Link href="/academy">Academy</Link><Link href="/academy/team-ai-enablement">Team AI Enablement</Link><Link href="/ai-workforce">AI Workforce</Link><Link href="/about">About Lymora</Link><Link href="/contact">Contact</Link></nav></div>
      </section>

      <div className="caio-sticky-apply"><span>CAIO™ Founding Cohort</span><Link href="#application">Apply for Eligibility <b>↗</b></Link></div>
    </>
  );
}
