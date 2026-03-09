"use client";

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

export function ToolChart({ chart }: ToolChartProps) {
  const sharedLegend = {
    legend: {
      labels: {
        color: "var(--color-muted)",
        usePointStyle: true,
        boxWidth: 10,
      },
    },
  };

  const sharedCartesianScales = {
    x: {
      ticks: {
        color: "var(--color-muted)",
      },
      grid: {
        color: "rgba(148, 163, 184, 0.16)",
      },
    },
    y: {
      ticks: {
        color: "var(--color-muted)",
        callback: (value: string | number) =>
          `${chart.valuePrefix ?? ""}${formatCompactNumber(Number(value))}${chart.valueSuffix ?? ""}`,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.16)",
      },
    },
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...sharedLegend,
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            `${context.dataset.label ?? ""}: ${chart.valuePrefix ?? ""}${Number(
              context.parsed.y ?? 0,
            ).toLocaleString("en-US")}${chart.valueSuffix ?? ""}`,
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
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label ?? ""}: ${chart.valuePrefix ?? ""}${Number(
              context.parsed.y ?? 0,
            ).toLocaleString("en-US")}${chart.valueSuffix ?? ""}`,
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
        callbacks: {
          label: (context: TooltipItem<"doughnut">) =>
            `${context.label}: ${chart.valuePrefix ?? ""}${Number(
              context.raw ?? 0,
            ).toLocaleString("en-US")}${chart.valueSuffix ?? ""}`,
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
