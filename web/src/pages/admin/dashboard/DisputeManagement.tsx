import StateCard from "@/shared/components/AdminCard";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * DisputeManagement dashboard section.
 *
 * Renders a grid of statistic cards related to dispute metrics using
 * the dynamic data. Shows a message if no data is available.
 *
 * @component
 * @returns {JSX.Element} The dispute management statistics grid or a message.
 */
export default function DisputeManagement({
  disputeData,
  isLoading,
  isError,
}: {
  disputeData?: {
    active: number;
    pending: number;
    resolved: number;
  };
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-12 flex items-center justify-center">
        <LoaderComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-12 text-center text-red-600 font-medium">
        Failed to load dispute overview
      </div>
    );
  }

  if (!disputeData) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-gray-500 font-medium">
        No data available
      </div>
    );
  }

  const displayDisputes = [
    { title: "Active Disputes", value: disputeData.active.toLocaleString() },
    {
      title: "Resolved Disputes",
      value: disputeData.resolved.toLocaleString(),
    },
    { title: "Pending Disputes", value: disputeData.pending.toLocaleString() },
  ];

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayDisputes.map((s, i) => (
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
