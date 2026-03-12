import { redirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  redirect(`/${defaultLocale}/tools/${slug}`);
}
