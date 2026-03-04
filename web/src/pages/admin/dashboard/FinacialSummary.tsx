import StateCard from "@/shared/components/AdminCard";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * FinancialSummary dashboard section.
 *
 * Renders a grid of financial statistic cards using the dynamic data.
 * Shows a message if no data is available.
 *
 * @component
 * @returns {JSX.Element} The financial summary statistics grid or a message.
 */
export default function FinancialSummary({
  financeData,
  isLoading,
  isError,
}: {
  financeData?: {
    engineerPayout: number;
    totalRefund: number;
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
        Failed to load financial summary
      </div>
    );
  }

  if (!financeData) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-gray-500 font-medium">
        No data available
      </div>
    );
  }

  const displayFinance = [
    {
      title: "Total Engineer Payouts",
      value: financeData.engineerPayout.toLocaleString(),
    },
    { title: "Total Refunds", value: financeData.totalRefund.toLocaleString() },
  ];

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayFinance.map((s, i) => (
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
