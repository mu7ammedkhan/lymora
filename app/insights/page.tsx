import Link from "next/link";
import { Breadcrumbs, SectionHeading } from "@/components/UI";
import { insights } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title:"AI Workforce Insights", description:"Practical articles on AI workforce strategy, team enablement, responsible AI and workflow design.", path:"/insights" });

export default function InsightsPage() {
  return <>
    <section className="page-hero"><div className="container">
      <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Insights"}]}/><span className="eyebrow">Lymora Intelligence</span>
      <h1>Clarity for the decisions AI is forcing now.</h1><p>Direct, practical thinking for leaders, teams and professionals building the next operating model for work.</p>
    </div></section>
    <section><div className="container"><SectionHeading eyebrow="Latest thinking" title="Ideas that survive contact with the workplace."/>
      <div className="insights-grid">{insights.map((article,index) => <Link href={`/insights/${article.slug}`} className={`article-card article-card-${index + 1}`} key={article.slug}>
        <div className="article-cover"><span>{String(index + 1).padStart(2,"0")}</span></div>
        <div className="article-content"><small>{article.category} · {article.readingTime}</small><h3>{article.title}</h3><p>{article.description}</p><span className="text-link">Read the perspective →</span></div>
      </Link>)}</div>
    </div></section>
  </>;
}
