import { disputeManagement } from "@/dummy_data/adminDashboard";
import StatCard from "@/shared/components/AdminCard";

/**
 * DisputeManagement dashboard section.
 *
 * Renders a grid of statistic cards related to dispute metrics using
 * the `disputeManagement` data source. Each item is rendered as a
 * `StatCard` showing title and value.
 *
 * @component
 * @returns {JSX.Element} The dispute management statistics grid.
 */
export default function DisputeManagement() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {disputeManagement.map((s, i) => (
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
