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
import type { GeneralChartProps } from "./type";

/**
 * GeneralChart - A flexible wrapper around Recharts that supports both line and bar charts.
 *
 * Features:
 * - Responsive container with customizable height and aspect ratio
 * - Supports both line and bar chart types with consistent API
 * - Configurable grid, legend, and tooltip visibility
 * - Custom styling through className prop
 * - Customizable Y-axis domain
 * - Series configuration with sensible defaults for colors and dimensions
 * - Empty state handling
 *
 * @component
 * @template T - Type of data items in the chart (must be a record/object)
 * @param {Object} props - Component props
 * @param {T[]} props.data - Array of data points to plot
 * @param {'line' | 'bar'} props.chartType - Type of chart to render
 * @param {keyof T} props.xAxisDataKey - Key in T to use for X-axis values
 * @param {number} [props.height=300] - Chart height in pixels
 * @param {number} [props.aspectRatio] - Optional aspect ratio for responsive container
 * @param {boolean} [props.showLegend=true] - Whether to show the chart legend
 * @param {boolean} [props.showTooltip=true] - Whether to show tooltips on hover
 * @param {boolean} [props.showGrid=true] - Whether to show grid lines
 * @param {[string | number, string | number]} [props.yAxisDomain=["auto", "auto"]] - Y-axis domain bounds
 * @param {React.ComponentType} [props.customTooltip] - Optional custom tooltip component
 * @param {string} [props.className] - Additional CSS classes
 * @param {SeriesConfig[]} props.series - Array of series configurations
 * @param {LegendConfig} [props.legend] - Optional legend configuration
 * @returns {JSX.Element} The chart component or an empty state message
 */
const GeneralChart = <T extends Record<string, unknown>>({
  data,
  chartType,
  xAxisDataKey,
  height = 300,
  showLegend = true,
  showTooltip = true,
  aspectRatio,
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

  const ChartComponent = chartType === "line" ? LineChart : BarChart;
  const SeriesComponent = chartType === "line" ? Line : Bar;

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className={className}
      {...(aspectRatio !== undefined ? { aspectRatio } : {})}
    >
      <ChartComponent data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#eee" />}

        <XAxis dataKey={xAxisDataKey as string} tick={{ fontSize: 12 }} />

        <YAxis domain={yAxisDomain} tick={{ fontSize: 12 }} />

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
              fill={s.fill || (chartType === "bar" ? "#d1d5db" : undefined)}
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
