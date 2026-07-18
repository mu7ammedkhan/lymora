import { Breadcrumbs, SectionHeading } from "@/components/UI";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Lymora",
  description: "Speak with Lymora about CAIO™, team AI enablement, AI readiness or managed workforce solutions.",
  path: "/contact"
});

export default function ContactPage() {
  return <>
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Contact"}]}/>
      <span className="eyebrow">Start a conversation</span>
      <h1>Let’s find the move that creates momentum.</h1>
      <p>Share the capability gap, team constraint or professional goal. We will help identify the clearest starting point.</p>
    </div></section>
    <section><div className="container split contact-layout">
      <div><SectionHeading eyebrow="Contact Lymora" title="A focused first conversation." text="Tell us what is not moving. We will help determine whether the answer is capability, workflow design, leadership alignment or managed capacity."/>
        <p><strong>Email</strong><br/><a className="text-link" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
        <p><strong>Location</strong><br/>{siteConfig.location}</p>
      </div>
      <form className="card contact-form" action={`mailto:${siteConfig.email}`} method="post" encType="text/plain"><div className="form-grid">
        <div className="form-field"><label htmlFor="name">Name</label><input id="name" name="name" required/></div>
        <div className="form-field"><label htmlFor="email">Email</label><input id="email" type="email" name="email" required/></div>
        <div className="form-field"><label htmlFor="company">Company</label><input id="company" name="company"/></div>
        <div className="form-field"><label htmlFor="interest">Interest</label><select id="interest" name="interest"><option>CAIO™ Certification</option><option>Team AI Enablement</option><option>AI Readiness Assessment</option><option>AI Workforce</option><option>Enterprise AI Transformation</option></select></div>
        <div className="form-field full"><label htmlFor="message">What needs to change?</label><textarea id="message" name="message" required/></div>
        <div className="form-field full"><button className="button" type="submit">Send enquiry <span>↗</span></button></div>
      </div></form>
    </div></section>
  </>;
}
