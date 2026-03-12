"use client";

import { useEffect, useMemo, useState } from "react";

import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolChart } from "@/components/tools/ToolChart";
import { ToolEducation } from "@/components/tools/ToolEducation";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolForm } from "@/components/tools/ToolForm";
import { ToolHero } from "@/components/tools/ToolHero";
import { ToolResult } from "@/components/tools/ToolResult";
import type { Locale } from "@/lib/i18n";
import { getToolBySlug } from "@/lib/tool-registry";
import type { FormState } from "@/lib/types";

type ToolPageClientProps = {
  locale: Locale;
  slug: string;
};

export function ToolPageClient({ locale, slug }: ToolPageClientProps) {
  const tool = getToolBySlug(slug, locale)!;
  const defaultState = useMemo(
    () => tool.definition.getDefaultState(locale),
    [locale, slug, tool.definition],
  );

  const [values, setValues] = useState<FormState>(() => defaultState);

  useEffect(() => {
    setValues(defaultState);
  }, [defaultState]);

  const parsedInputs = useMemo(
    () => tool.definition.parseInputs(values),
    [tool.definition, values],
  );
  const result = useMemo(
    () => tool.definition.calculate(parsedInputs),
    [parsedInputs, tool.definition],
  );
  const resultCards = useMemo(
    () => tool.definition.buildSummaryItems(result, locale),
    [locale, result, tool.definition],
  );
  const chart = useMemo(
    () => tool.definition.buildChartData?.(result, locale),
    [locale, result, tool.definition],
  );

  return (
    <div className="content-shell pb-20 pt-4">
      <ToolHero locale={locale} tool={tool} />
      <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
        <ToolForm
          locale={locale}
          fields={tool.definition.getFields(locale)}
          values={values}
          onChange={(key, value) =>
            setValues((current) => ({
              ...current,
              [key]: value,
            }))
          }
          onAllocationChange={(key, allocationKey, value) =>
            setValues((current) => {
              const existing = Array.isArray(current[key]) ? current[key] : [];

              return {
                ...current,
                [key]: existing.map((item) =>
                  item.key === allocationKey ? { ...item, value } : item,
                ),
              };
            })
          }
        />
        <div className="space-y-8">
          <ToolResult items={resultCards} locale={locale} />
          {chart ? <ToolChart chart={chart} locale={locale} /> : null}
        </div>
      </div>
      <ToolEducation sections={tool.educationContent} locale={locale} />
      <ToolFaq faq={tool.faq} locale={locale} />
      <RelatedTools locale={locale} slugs={tool.relatedTools} />
    </div>
  );
}
