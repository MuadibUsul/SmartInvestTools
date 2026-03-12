"use client";

import { getSiteDictionary } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import type { AllocationFormValue, FormState, ToolFieldConfig } from "@/lib/types";

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

          return (
            <label key={field.key} className="space-y-2.5">
              <span className="block text-sm font-semibold text-[var(--color-text)]">
                {field.label}
              </span>
              {field.helpText ? (
                <span className="block text-sm leading-6 text-[var(--color-muted)]">
                  {field.helpText}
                </span>
              ) : null}
              <div className="field-shell flex min-h-14 items-center gap-3">
                {field.prefix ? (
                  <span className="text-sm font-medium text-[var(--color-muted)]">
                    {field.prefix}
                  </span>
                ) : null}
                <input
                  type={renderInputType(field.type)}
                  inputMode={field.type === "ticker" ? "text" : "decimal"}
                  value={getDisplayValue(values[field.key])}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    onChange(
                      field.key,
                      field.type === "ticker"
                        ? event.target.value.toUpperCase()
                        : event.target.value,
                    )
                  }
                  className="w-full bg-transparent text-[1.02rem] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-soft)]"
                />
                {field.suffix ? (
                  <span className="text-sm font-medium text-[var(--color-muted)]">
                    {field.suffix}
                  </span>
                ) : null}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
