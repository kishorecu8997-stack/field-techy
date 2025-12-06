import { jobsMetrics } from "@/dummy_data/adminDashboard";
import StateCard from "@/shared/components/AdminCard";

/**
 * JobsMetrics dashboard section.
 *
 * Renders a grid of statistic cards representing job-related metrics using
 * the `jobsMetrics` data source. Each metric is displayed as a `StatCard`
 * showing a title and its current value.
 *
 * @component
 * @returns {JSX.Element} The jobs metrics statistics grid.
 */
export default function JobsMetrics() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobsMetrics.map((s, i) => (
          <StateCard
            key={i}
            title={s.title}
            value={s.value}
            alt="Engineer"
            className=""
          />
        ))}
      </div>
    </div>
  );
}
