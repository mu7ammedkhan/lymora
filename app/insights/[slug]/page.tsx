import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, CTA } from "@/components/UI";
import { JsonLd } from "@/components/JsonLd";
import { insights } from "@/lib/site";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams(){return insights.map(item=>({slug:item.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const article=insights.find(item=>item.slug===slug);
  if(!article)return {};
  return pageMetadata({title:article.title,description:article.description,path:`/insights/${article.slug}`,keywords:[article.title,article.category,"AI workforce UAE","responsible AI adoption"]});
}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const article=insights.find(item=>item.slug===slug);
  if(!article)notFound();
  const path=`/insights/${article.slug}`;
  return <>
    <JsonLd data={[
      articleSchema({title:article.title,description:article.description,path,datePublished:article.date}),
      breadcrumbSchema([{name:"Home",path:"/"},{name:"Insights",path:"/insights"},{name:article.title,path}])
    ]}/>
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Insights",href:"/insights"},{label:article.title}]}/><span className="eyebrow">{article.category} · {article.readingTime}</span><h1>{article.title}</h1><p>{article.description}</p></div></section>
    <section><div className="container content-grid"><article className="prose"><div className="answer-block" id="direct-answer">{article.answer}</div>{article.sections.map((section,index)=><section className="article-section" id={`section-${index+1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.points.length>0&&<ul>{section.points.map(point=><li key={point}>{point}</li>)}</ul>}</section>)}<h2 id="next-step">A practical next step</h2><p>Choose one team, role or workflow and establish the current baseline before changing it. Then decide whether the gap is primarily training, workflow design, governance, implementation capacity or ongoing workforce support.</p><p><Link className="text-link" href="/ai-solutions">Explore practical AI solutions →</Link></p></article><aside className="sidebar"><h3>In this guide</h3><a href="#direct-answer">Direct answer</a>{article.sections.map((section,index)=><a href={`#section-${index+1}`} key={section.heading}>{section.heading}</a>)}<a href="#next-step">Practical next step</a><h3>Related guides</h3>{insights.filter(item=>item.slug!==article.slug).map(item=><Link href={`/insights/${item.slug}`} key={item.slug}>{item.title}</Link>)}</aside></div></section>
    <CTA title="Turn insight into operating capability." text="Explore team enablement, readiness assessment, workflow implementation or managed AI workforce services with Lymora." secondary="View methodologies" secondaryHref="/methodologies" />
  </>;
}
