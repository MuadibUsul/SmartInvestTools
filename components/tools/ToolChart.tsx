"use client";

import { useEffect, useState } from "react";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  type TooltipItem,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { formatCompactNumber } from "@/lib/format";
import { getIntlLocale, type Locale } from "@/lib/i18n";
import type { ToolChartData } from "@/lib/types";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

type ToolChartProps = {
  chart: ToolChartData;
  locale: Locale;
};

type ChartTheme = {
  legend: string;
  tick: string;
  grid: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tooltipText: string;
};

function toDatasetColor(index: number) {
  const palette = [
    "rgba(15, 155, 142, 0.9)",
    "rgba(245, 158, 11, 0.92)",
    "rgba(59, 130, 246, 0.92)",
    "rgba(148, 163, 184, 0.92)",
  ];

  return palette[index % palette.length];
}

const fallbackChartTheme: ChartTheme = {
  legend: "#0f172a",
  tick: "#526072",
  grid: "rgba(148, 163, 184, 0.18)",
  tooltipBackground: "#ffffff",
  tooltipBorder: "rgba(15, 23, 42, 0.08)",
  tooltipText: "#0f172a",
};

function readChartTheme(): ChartTheme {
  if (typeof window === "undefined") {
    return fallbackChartTheme;
  }

  const styles = getComputedStyle(document.documentElement);
  const read = (property: string, fallback: string) =>
    styles.getPropertyValue(property).trim() || fallback;

  return {
    legend: read("--color-text", fallbackChartTheme.legend),
    tick: read("--color-muted", fallbackChartTheme.tick),
    grid: read("--color-border", fallbackChartTheme.grid),
    tooltipBackground: read(
      "--color-surface-strong",
      fallbackChartTheme.tooltipBackground,
    ),
    tooltipBorder: read("--color-border", fallbackChartTheme.tooltipBorder),
    tooltipText: read("--color-text", fallbackChartTheme.tooltipText),
  };
}

export function ToolChart({ chart, locale }: ToolChartProps) {
  const [chartTheme, setChartTheme] = useState<ChartTheme>(fallbackChartTheme);

  useEffect(() => {
    const syncTheme = () => {
      setChartTheme(readChartTheme());
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const sharedLegend = {
    legend: {
      labels: {
        color: chartTheme.legend,
        usePointStyle: true,
        boxWidth: 10,
        padding: 16,
      },
    },
  };

  const sharedCartesianScales = {
    x: {
      ticks: {
        color: chartTheme.tick,
      },
      grid: {
        color: chartTheme.grid,
      },
    },
    y: {
      ticks: {
        color: chartTheme.tick,
        callback: (value: string | number) =>
          `${chart.valuePrefix ?? ""}${formatCompactNumber(Number(value), locale)}${chart.valueSuffix ?? ""}`,
      },
      grid: {
        color: chartTheme.grid,
      },
    },
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...sharedLegend,
      tooltip: {
        backgroundColor: chartTheme.tooltipBackground,
        borderColor: chartTheme.tooltipBorder,
        borderWidth: 1,
        titleColor: chartTheme.tooltipText,
        bodyColor: chartTheme.tooltipText,
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            `${context.dataset.label ?? ""}: ${chart.valuePrefix ?? ""}${Number(
              context.parsed.y ?? 0,
            ).toLocaleString(getIntlLocale(locale))}${chart.valueSuffix ?? ""}`,
        },
      },
    },
    scales: sharedCartesianScales,
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...sharedLegend,
      tooltip: {
        backgroundColor: chartTheme.tooltipBackground,
        borderColor: chartTheme.tooltipBorder,
        borderWidth: 1,
        titleColor: chartTheme.tooltipText,
        bodyColor: chartTheme.tooltipText,
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label ?? ""}: ${chart.valuePrefix ?? ""}${Number(
              context.parsed.y ?? 0,
            ).toLocaleString(getIntlLocale(locale))}${chart.valueSuffix ?? ""}`,
        },
      },
    },
    scales: sharedCartesianScales,
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      ...sharedLegend,
      tooltip: {
        backgroundColor: chartTheme.tooltipBackground,
        borderColor: chartTheme.tooltipBorder,
        borderWidth: 1,
        titleColor: chartTheme.tooltipText,
        bodyColor: chartTheme.tooltipText,
        callbacks: {
          label: (context: TooltipItem<"doughnut">) =>
            `${context.label}: ${chart.valuePrefix ?? ""}${Number(
              context.raw ?? 0,
            ).toLocaleString(getIntlLocale(locale))}${chart.valueSuffix ?? ""}`,
        },
      },
    },
  };

  return (
    <section className="card-surface space-y-6">
      <div className="space-y-2">
        <h2 className="section-title">{chart.title}</h2>
        {chart.description ? (
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            {chart.description}
          </p>
        ) : null}
      </div>
      <div className="h-[320px] w-full sm:h-[380px]">
        {chart.type === "line" ? (
          <Line
            data={{
              labels: chart.labels,
              datasets: chart.datasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor:
                  dataset.backgroundColor ?? "rgba(15, 155, 142, 0.14)",
                borderColor: dataset.borderColor ?? toDatasetColor(index),
                tension: 0.34,
                fill: true,
                borderWidth: 2,
              })),
            }}
            options={lineOptions}
          />
        ) : null}
        {chart.type === "bar" ? (
          <Bar
            data={{
              labels: chart.labels,
              datasets: chart.datasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor ?? toDatasetColor(index),
                borderColor: dataset.borderColor ?? toDatasetColor(index),
                borderWidth: 2,
              })),
            }}
            options={barOptions}
          />
        ) : null}
        {chart.type === "doughnut" ? (
          <Doughnut
            data={{
              labels: chart.labels,
              datasets: chart.datasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor ?? toDatasetColor(index),
                borderColor: dataset.borderColor ?? toDatasetColor(index),
                borderWidth: 2,
              })),
            }}
            options={doughnutOptions}
          />
        ) : null}
      </div>
    </section>
  );
}
