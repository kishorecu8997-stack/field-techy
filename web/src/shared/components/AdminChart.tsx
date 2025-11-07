/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Chart type enum (string union) - selects which Recharts component to render.
 */
type ChartType = "line" | "bar";

/**
 * Configuration for a single data series rendered on the chart.
 *
 * - dataKey: key in the data objects to read values from
 * - name: legend/label for the series
 * - stroke/fill: color values for line/bar
 * - strokeWidth: line thickness
 * - dot/activeDot: configuration for line chart markers
 */
interface SeriesConfig {
  dataKey: string;
  name: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  dot?: boolean | { r: number };
  activeDot?: boolean | { r: number };
}

/**
 * Optional legend configuration passed to Recharts `Legend` component.
 */
interface LegendConfig {
  verticalAlign?: "top" | "bottom" | "middle";
  align?: "left" | "center" | "right";
  wrapperStyle?: React.CSSProperties;
}

/**
 * Props for the `GeneralChart` component.
 *
 * Generic over the data row shape `T` so callers can pass typed arrays.
 * - data: array of data points
 * - chartType: "line" or "bar"
 * - xAxisDataKey: key in `T` used for X axis labels
 * - series: array of SeriesConfig describing which keys to plot
 */
interface GeneralChartProps<T = any> {
  data: T[];
  chartType: ChartType;
  xAxisDataKey: keyof T;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  yAxisDomain?: [
    number | "auto" | "dataMin" | "dataMax",
    number | "auto" | "dataMin" | "dataMax"
  ];
  customTooltip?: React.ComponentType<any>;
  className?: string;
  series: SeriesConfig[];
  legend?: LegendConfig;
}

/**
 * GeneralChart
 *
 * A thin, typed wrapper around Recharts `LineChart` and `BarChart` that
 * accepts a simple `series` configuration to render multiple series and
 * supports optional tooltip, legend and grid settings. The component is
 * generic in the shape of the data rows (T) so callers can provide
 * typed data arrays.
 *
 * @template T - data row type
 */
const GeneralChart = <T extends Record<string, any>>({
  data,
  chartType,
  xAxisDataKey,
  height = 300,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  yAxisDomain = ["auto", "auto"],
  customTooltip: CustomTooltip,
  className = "",
  series,
  legend,
}: GeneralChartProps<T>) => {
  if (data.length === 0) {
    return (
      <div
        className={`bg-gray-50 rounded flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500">No data</span>
      </div>
    );
  }

  // Choose chart component
  const ChartComponent = chartType === "line" ? LineChart : BarChart;
  const SeriesComponent = chartType === "line" ? Line : Bar;

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <ChartComponent data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />}

        <XAxis dataKey={xAxisDataKey as string} tick={{ fontSize: 12 }} />

        <YAxis domain={yAxisDomain as any} tick={{ fontSize: 12 }} />

        {showTooltip &&
          (CustomTooltip ? (
            <Tooltip content={<CustomTooltip />} />
          ) : (
            <Tooltip />
          ))}

        {showLegend && (
          <Legend
            verticalAlign={legend?.verticalAlign || "bottom"}
            align={legend?.align || "center"}
            wrapperStyle={legend?.wrapperStyle}
          />
        )}

        {series &&
          series?.map((s, idx) => (
            <SeriesComponent
              key={idx}
              type={chartType === "line" ? "monotone" : undefined}
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.stroke || (chartType === "line" ? "#555" : undefined)}
              fill={s.fill || (chartType === "bar" ? "#d1d5db" : undefined)} // 👈 default gray for bar
              strokeWidth={
                s.strokeWidth || (chartType === "line" ? 2 : undefined)
              }
              dot={
                chartType === "line"
                  ? typeof s.dot === "undefined"
                    ? { r: 3 }
                    : s.dot
                  : false
              }
              activeDot={
                chartType === "line"
                  ? typeof s.activeDot === "undefined"
                    ? { r: 6 }
                    : s.activeDot
                  : false
              }
            />
          ))}
      </ChartComponent>
    </ResponsiveContainer>
  );
};

export default GeneralChart;
