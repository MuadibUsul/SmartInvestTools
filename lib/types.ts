import type { Locale } from "@/lib/i18n";

export type ToolFieldType =
  | "currency"
  | "number"
  | "percentage"
  | "ticker"
  | "allocation-list";

export type AllocationFormValue = {
  key: string;
  label: string;
  value: string;
};

export type FormState = Record<string, string | AllocationFormValue[]>;

export type ToolFieldConfig = {
  key: string;
  label: string;
  type: ToolFieldType;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string;
  helpText?: string;
  items?: AllocationFormValue[];
};

export type ResultCard = {
  label: string;
  value: string;
  helperText?: string;
  detailValue?: string;
  tone?: "--color-accent" | "--color-highlight" | "--color-text";
};

export type ToolChartData = {
  type: "line" | "bar" | "doughnut";
  title: string;
  description?: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
  }>;
  valuePrefix?: string;
  valueSuffix?: string;
};

export type ToolFaqItem = {
  question: string;
  answer: string;
};

export type EducationSection = {
  heading: string;
  paragraphs: string[];
};

export type ToolSeoMeta = {
  title: string;
  description: string;
};

export type ToolConfig = {
  slug: string;
  hasChart: boolean;
  relatedTools: string[];
  locales: Record<
    Locale,
    {
      title: string;
      shortDescription: string;
      longDescription: string;
      category: string;
      tags: string[];
      seo: ToolSeoMeta;
      faq: ToolFaqItem[];
      educationContent: EducationSection[];
    }
  >;
};

export type ToolDefinition<TParsedInput = unknown, TResult = unknown> = {
  getFields: (locale: Locale) => ToolFieldConfig[];
  getDefaultState: (locale: Locale) => FormState;
  parseInputs: (values: FormState) => TParsedInput;
  calculate: (inputs: TParsedInput) => TResult;
  buildSummaryItems: (result: TResult, locale: Locale) => ResultCard[];
  buildChartData?: (result: TResult, locale: Locale) => ToolChartData | undefined;
};

export type LocalizedTool = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  tags: string[];
  hasChart: boolean;
  seo: ToolSeoMeta;
  faq: ToolFaqItem[];
  educationContent: EducationSection[];
  relatedTools: string[];
};

export type RegisteredTool = LocalizedTool & {
  definition: ToolDefinition;
};
