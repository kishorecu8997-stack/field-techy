import StateCard from "@/shared/components/AdminCard";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * JobsMetrics dashboard section.
 *
 * Renders a grid of statistic cards representing job-related metrics using
 * the dynamic data. Shows a message if no data is available.
 *
 * @component
 * @returns {JSX.Element} The jobs metrics statistics grid or a message.
 */
export default function JobsMetrics({
  jobsData,
  isLoading,
  isError,
}: {
  jobsData?: {
    live: number;
    completed: number;
    pending: number;
    disputed: number;
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
        Failed to load job metrics
      </div>
    );
  }

  if (!jobsData) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-gray-500 font-medium">
        No data available
      </div>
    );
  }

  const displayJobs = [
    { title: "Live Jobs", value: jobsData.live.toLocaleString() },
    { title: "Completed Jobs", value: jobsData.completed.toLocaleString() },
    { title: "Pending Jobs", value: jobsData.pending.toLocaleString() },
    { title: "Disputed Jobs", value: jobsData.disputed.toLocaleString() },
  ];

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayJobs.map((s, i) => (
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
