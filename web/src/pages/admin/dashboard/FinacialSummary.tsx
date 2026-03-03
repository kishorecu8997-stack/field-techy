import StateCard from "@/shared/components/AdminCard";

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
}: {
  financeData?: {
    engineerPayout: number;
    totalRefund: number;
  };
}) {
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
