import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getArticle, getArticles } from "@/lib/insights";
import { getCompany } from "@/lib/content";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const company = getCompany(article.subsidiary as never);

  return (
    <Container as="article" className="max-w-3xl py-20 sm:py-28">
      <p className="eyebrow">
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        {company ? <> · {company.name}</> : null}
      </p>
      <h1 className="mt-4 font-serif text-display-lg font-medium">{article.title}</h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {company ? (
        <div className="mt-14 rounded-2xl border border-line bg-surface p-8" data-subsidiary={company.slug}>
          <p className="font-serif text-xl font-medium">
            This is what {company.name} does all day.
          </p>
          <p className="mt-2 text-sm text-muted">{company.summary}</p>
          <Link
            href={`/companies/${company.slug}`}
            className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Learn more →
          </Link>
        </div>
      ) : null}
    </Container>
  );
}
