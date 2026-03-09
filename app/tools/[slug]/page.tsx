import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolPageClient } from "@/components/tools/ToolPageClient";
import { getAllTools, getToolBySlug } from "@/lib/tool-registry";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found | Smart Invest Tools",
      description: "The requested financial tool could not be found.",
    };
  }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
      url: `/tools/${tool.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolPageClient slug={slug} />;
}
