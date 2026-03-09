"use client";

import { useMemo, useState } from "react";

import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolChart } from "@/components/tools/ToolChart";
import { ToolEducation } from "@/components/tools/ToolEducation";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolForm } from "@/components/tools/ToolForm";
import { ToolHero } from "@/components/tools/ToolHero";
import { ToolResult } from "@/components/tools/ToolResult";
import { getToolBySlug } from "@/lib/tool-registry";
import type { FormState } from "@/lib/types";

type ToolPageClientProps = {
  slug: string;
};

export function ToolPageClient({ slug }: ToolPageClientProps) {
  const tool = getToolBySlug(slug)!;

  const [values, setValues] = useState<FormState>(() => tool.definition.defaults);

  const parsedInputs = useMemo(
    () => tool.definition.parseInputs(values),
    [tool.definition, values],
  );
  const result = useMemo(
    () => tool.definition.calculate(parsedInputs),
    [parsedInputs, tool.definition],
  );
  const resultCards = useMemo(
    () => tool.definition.buildSummaryItems(result),
    [result, tool.definition],
  );
  const chart = useMemo(
    () => tool.definition.buildChartData?.(result),
    [result, tool.definition],
  );

  return (
    <div className="content-shell pb-20 pt-4">
      <ToolHero tool={tool} />
      <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
        <ToolForm
          fields={tool.definition.fields}
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
          <ToolResult items={resultCards} />
          {chart ? <ToolChart chart={chart} /> : null}
        </div>
      </div>
      <ToolEducation sections={tool.educationContent} />
      <ToolFaq faq={tool.faq} />
      <RelatedTools slugs={tool.relatedTools} />
    </div>
  );
}
