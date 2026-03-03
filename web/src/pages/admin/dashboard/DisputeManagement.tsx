import StateCard from "@/shared/components/AdminCard";

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
}: {
  disputeData?: {
    active: number;
    pending: number;
    resolved: number;
  };
}) {
  if (!disputeData) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-gray-500 font-medium">
        No data available
      </div>
    );
  }

  const displayDisputes = [
    { title: "Active Disputes", value: disputeData.active.toLocaleString() },
    { title: "Resoloved Disputes", value: disputeData.resolved.toLocaleString() },
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
