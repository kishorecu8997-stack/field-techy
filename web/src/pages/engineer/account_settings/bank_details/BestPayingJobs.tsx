import { transactions } from "@/dummy_data/bankDetails";
import { formatCurrency } from "@/shared/libs/utils";
import React, { useState } from "react";
import { BiBriefcase, BiChevronDown, BiChevronUp } from "react-icons/bi";

interface JobEarning {
  client: string;
  totalEarnings: number;
  transactionCount: number;
}

/**
 * Represents aggregated earning information for a job/client.
 *
 * @interface JobEarning
 * @property {string} client - Name of the client or job source.
 * @property {number} totalEarnings - Total amount earned from this client.
 * @property {number} transactionCount - Number of transactions associated with this client.
 */
const BestPayingJobs: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const calculateTopJobs = (): JobEarning[] => {
    const earningsMap = new Map<string, JobEarning>();
    transactions.forEach((tx) => {
      if (tx.amount > 0) {
        const client = tx.description || "Unknown Client";
        const existing = earningsMap.get(client);
        if (existing) {
          existing.totalEarnings += tx.amount;
          existing.transactionCount += 1;
        } else {
          earningsMap.set(client, {
            client,
            totalEarnings: tx.amount,
            transactionCount: 1,
          });
        }
      }
    });

    return Array.from(earningsMap.values())
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5);
  };

  const topJobs = calculateTopJobs();
  // Preview: Show top earner only
  const topEarner = topJobs[0] || null;
  const totalClients = topJobs.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Clickable Header with Preview */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <BiBriefcase className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Best Paying Jobs / Clients
            </h2>
            {topEarner ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Top:{" "}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(topEarner.totalEarnings)}
                </span>{" "}
                from <span className="font-medium">{topEarner.client}</span> (
                {totalClients} {totalClients === 1 ? "client" : "clients"})
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                No earnings yet — start completing jobs!
              </p>
            )}
          </div>
        </div>

        <div
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          {isExpanded ? (
            <BiChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <BiChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expandable Full List */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2">
          {topJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No earnings recorded yet. Complete your first job to see top
                clients!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topJobs.map((job, index) => (
                <div
                  key={job.client}
                  className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 shadow-md ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : index === 2
                              ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Client Info */}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {job.client}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.transactionCount} transaction
                        {job.transactionCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(job.totalEarnings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {topJobs.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              Based on completed earnings
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestPayingJobs;
