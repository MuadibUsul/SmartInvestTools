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

export type ToolDefinition<TParsedInput = unknown, TResult = unknown> = {
  fields: ToolFieldConfig[];
  defaults: FormState;
  parseInputs: (values: FormState) => TParsedInput;
  calculate: (inputs: TParsedInput) => TResult;
  buildSummaryItems: (result: TResult) => ResultCard[];
  buildChartData?: (result: TResult) => ToolChartData | undefined;
};

export type RegisteredTool = ToolConfig & {
  definition: ToolDefinition;
};
