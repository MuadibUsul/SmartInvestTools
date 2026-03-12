import type { Locale } from "@/lib/i18n";
import { getAllTools } from "@/lib/tool-registry";
import type { LocalizedTool } from "@/lib/types";

export type ToolCategoryGroup = {
  id: string;
  label: string;
  tools: LocalizedTool[];
};

export function toAnchorId(value: string) {
  const normalized = [...value.trim().toLowerCase()]
    .map((character) =>
      /[a-z0-9]/.test(character)
        ? character
        : character === " "
          ? "-"
          : character.codePointAt(0)?.toString(16),
    )
    .filter(Boolean)
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized ? `section-${normalized}` : "section-tools";
}

export function getToolCategoryGroups(locale: Locale): ToolCategoryGroup[] {
  const groups = new Map<string, LocalizedTool[]>();

  for (const tool of getAllTools(locale)) {
    const current = groups.get(tool.category) ?? [];
    current.push(tool);
    groups.set(tool.category, current);
  }

  return Array.from(groups.entries()).map(([label, tools]) => ({
    id: toAnchorId(label),
    label,
    tools,
  }));
}

