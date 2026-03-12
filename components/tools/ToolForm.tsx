"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getSiteDictionary } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import type {
  AllocationFormValue,
  FormState,
  ToolFieldConfig,
} from "@/lib/types";

type ToolFormProps = {
  locale: Locale;
  fields: ToolFieldConfig[];
  values: FormState;
  onChange: (key: string, value: string) => void;
  onAllocationChange: (
    key: string,
    allocationKey: string,
    value: string,
  ) => void;
};

type TickerAutocompleteProps = {
  field: ToolFieldConfig;
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
};

function renderInputType(type: ToolFieldConfig["type"]) {
  if (type === "ticker") {
    return "text";
  }

  return "number";
}

function getDisplayValue(value: FormState[string]) {
  return typeof value === "string" ? value : "";
}

function getAllocationValue(
  value: FormState[string],
  allocationKey: string,
): string {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.find((item) => item.key === allocationKey)?.value.toString() ?? "";
}

function normalizeSuggestionText(value: string) {
  return value.trim().toUpperCase();
}

function getFilteredSuggestions(field: ToolFieldConfig, value: string) {
  const suggestions = field.suggestions ?? [];
  const normalizedQuery = normalizeSuggestionText(value);

  if (!normalizedQuery) {
    return suggestions.slice(0, 8);
  }

  return suggestions
    .map((suggestion) => {
      const valueText = normalizeSuggestionText(suggestion.value);
      const labelText = normalizeSuggestionText(suggestion.label ?? "");
      const startsWithTicker = valueText.startsWith(normalizedQuery);
      const startsWithLabel = labelText.startsWith(normalizedQuery);
      const includesTicker = valueText.includes(normalizedQuery);
      const includesLabel = labelText.includes(normalizedQuery);

      let score = -1;

      if (startsWithTicker) {
        score = 0;
      } else if (startsWithLabel) {
        score = 1;
      } else if (includesTicker) {
        score = 2;
      } else if (includesLabel) {
        score = 3;
      }

      return {
        suggestion,
        score,
      };
    })
    .filter((entry) => entry.score >= 0)
    .sort((left, right) => left.score - right.score)
    .slice(0, 8)
    .map((entry) => entry.suggestion);
}

function TickerAutocomplete({
  field,
  locale,
  value,
  onChange,
}: TickerAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredSuggestions = useMemo(
    () => getFilteredSuggestions(field, value),
    [field, value],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [value, open]);

  function selectSuggestion(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="field-shell flex min-h-14 items-center gap-3">
        {field.prefix ? (
          <span className="text-sm font-medium text-[var(--color-muted)]">
            {field.prefix}
          </span>
        ) : null}
        <input
          id={field.key}
          type="text"
          inputMode="text"
          autoComplete="off"
          value={value}
          placeholder={field.placeholder}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (!open && event.key === "ArrowDown" && filteredSuggestions.length > 0) {
              setOpen(true);
              setActiveIndex(0);
              return;
            }

            if (!open || filteredSuggestions.length === 0) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((current) =>
                Math.min(current + 1, filteredSuggestions.length - 1),
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            }

            if (event.key === "Enter") {
              event.preventDefault();
              selectSuggestion(filteredSuggestions[activeIndex].value);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className="w-full bg-transparent text-[1.02rem] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-soft)]"
        />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={locale === "zh" ? "切换 ETF 建议列表" : "Toggle ETF suggestions"}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          {open ? "^" : "v"}
        </button>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-[1.2rem] border border-[var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-soft)] backdrop-blur">
          {filteredSuggestions.length > 0 ? (
            <div className="max-h-72 overflow-y-auto p-1.5">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={`${field.key}-${suggestion.value}`}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(suggestion.value);
                  }}
                  className={`flex w-full items-start justify-between gap-4 rounded-[0.95rem] px-3.5 py-3 text-left ${
                    index === activeIndex
                      ? "bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)]"
                      : "hover:bg-[color:var(--color-surface-strong)]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-text)]">
                      {suggestion.value}
                    </div>
                    {suggestion.label ? (
                      <div className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                        {suggestion.label}
                      </div>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-[var(--color-muted)]">
              {locale === "zh"
                ? "没有匹配的 ETF，请继续输入代码或基金名称。"
                : "No matching ETF found. Keep typing a ticker or fund name."}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function ToolForm({
  locale,
  fields,
  values,
  onChange,
  onAllocationChange,
}: ToolFormProps) {
  const dictionary = getSiteDictionary(locale);

  return (
    <section className="card-surface space-y-7">
      <div className="space-y-3">
        <h2 className="section-title">{dictionary.toolUi.inputsTitle}</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {dictionary.toolUi.inputsDescription}
        </p>
      </div>
      <div className="grid gap-5">
        {fields.map((field) => {
          if (field.type === "allocation-list") {
            const items = field.items as AllocationFormValue[];

            return (
              <div key={field.key} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[var(--color-text)]">
                    {field.label}
                  </label>
                  {field.helpText ? (
                    <p className="text-sm text-[var(--color-muted)]">
                      {field.helpText}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {items.map((item) => (
                    <label key={item.key} className="field-shell">
                      <span className="mb-3 block text-sm font-medium text-[var(--color-text)]">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          inputMode="decimal"
                          value={getAllocationValue(values[field.key], item.key)}
                          min={0}
                          max={100}
                          step="0.1"
                          onChange={(event) =>
                            onAllocationChange(
                              field.key,
                              item.key,
                              event.target.value,
                            )
                          }
                          className="w-full bg-transparent text-base text-[var(--color-text)] outline-none"
                        />
                        <span className="text-sm text-[var(--color-muted)]">%</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          const value = getDisplayValue(values[field.key]);

          return (
            <div key={field.key} className="space-y-2.5">
              <label
                htmlFor={field.key}
                className="block text-sm font-semibold text-[var(--color-text)]"
              >
                {field.label}
              </label>
              {field.helpText ? (
                <span className="block text-sm leading-6 text-[var(--color-muted)]">
                  {field.helpText}
                </span>
              ) : null}
              {field.type === "ticker" && field.suggestions?.length ? (
                <TickerAutocomplete
                  field={field}
                  locale={locale}
                  value={value}
                  onChange={(nextValue) => onChange(field.key, nextValue)}
                />
              ) : (
                <div className="field-shell flex min-h-14 items-center gap-3">
                  {field.prefix ? (
                    <span className="text-sm font-medium text-[var(--color-muted)]">
                      {field.prefix}
                    </span>
                  ) : null}
                  <input
                    id={field.key}
                    type={renderInputType(field.type)}
                    inputMode={field.type === "ticker" ? "text" : "decimal"}
                    value={value}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.placeholder}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    className="w-full bg-transparent text-[1.02rem] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-soft)]"
                  />
                  {field.suffix ? (
                    <span className="text-sm font-medium text-[var(--color-muted)]">
                      {field.suffix}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
