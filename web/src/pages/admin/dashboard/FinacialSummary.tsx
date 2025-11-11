import { finacialSummary } from "@/dummy_data/adminDashboard";
import StatCard from "@/shared/components/AdminCard";

/**
 * FinancialSummary dashboard section.
 *
 * Renders a grid of financial statistic cards using the `finacialSummary`
 * data source. Each entry is displayed as a `StatCard` showing a title and
 * a value.
 *
 * Note: the data source filename uses the spelling `finacialSummary`.
 *
 * @component
 * @returns {JSX.Element} The financial summary statistics grid.
 */
export default function FinancialSummary() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {finacialSummary.map((s, i) => (
          <StatCard
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
