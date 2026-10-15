import Image from "next/image";
import { photos } from "@/lib/media";
import Link from "next/link";
import { SectionHeading, PageHero } from "@/components/UI";
import { insights } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title:"AI Workforce Insights", description:"Practical articles on AI workforce strategy, team enablement, responsible AI and workflow design.", path:"/insights" });

const covers = [photos.teamCollab, photos.workshop, photos.handsLaptop];

export default function InsightsPage() {
  return <>
    <PageHero media="insights" crumbs={[{label:"Home",href:"/"},{label:"Insights"}]} eyebrow="Lymora Intelligence" title="Clarity for the decisions *AI is forcing now.*" text="Direct, practical thinking for leaders, teams and professionals building the next operating model for work." />
    <section><div className="container"><SectionHeading eyebrow="Latest thinking" title="Ideas that survive contact with the workplace."/>
      <div className="insights-grid">{insights.map((article,index) => <Link href={`/insights/${article.slug}`} className={`article-card article-card-${index + 1}`} key={article.slug}>
        <div className="article-cover"><Image src={covers[index % covers.length].src} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /><span>{String(index + 1).padStart(2,"0")}</span></div>
        <div className="article-content"><small>{article.category} · {article.readingTime}</small><h3>{article.title}</h3><p>{article.description}</p><span className="text-link">Read the perspective →</span></div>
      </Link>)}</div>
    </div></section>
  </>;
}
