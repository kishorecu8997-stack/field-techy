import { bankListData } from "@/dummy_data/bankDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
 import type { bankDetails } from "./types";
import { useTransactionStore } from "@/dummy_data/transactionStore";
import { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/shared/libs/utils";
import { HiArrowLeft, HiClock, HiChartBar } from "react-icons/hi";
/**
 * Withdrawal form page displaying available balance and allowing users to select a bank and enter an amount.
 * Includes validation for numeric input and a submit button for initiating withdrawal.
 */
const Withdraw = () => {
  const { showPopup } = usePopupStore();
  const { addTransaction } = useTransactionStore();
  const { transactions } = useTransactionStore();
  const [view, setView] = useState<"form" | "history" | "chart">("form");

  const FormCtx = useForm<bankDetails>({
    mode: "onSubmit",
  });

  const availableBalance = 1000;
  const minRetainedBalance = 10;

  const withdrawalHistory = transactions.filter(
    (t) => t.amount < 0 && t.description.toLowerCase().includes("withdraw")
  );

  const chartData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    let current = 0;
    return sorted.map((t) => {
      current += t.amount;
      return { date: new Date(t.date), value: current };
    });
  }, [transactions]);

  const handleSubmit = async (data: bankDetails) => {
    await showPopup({
      title: "Withdrawal Initiated",
      body: "Are you sure you want to initiate this withdrawal?",
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "outline",
        },
        {
          label: "Yes, initiate",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            console.log("Submitted data:", data);
            addTransaction({
              id: Date.now(),
              description: `Withdrawal to ${data.bank}`,
              amount: -parseFloat(data.amount),
              date: new Date(),
              status: "Pending",
            });
            toast.success("Withdrawal initiated successfully");
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-28 flex-shrink-0">
        <AvailableBalance
          currentView={view}
          onViewChange={setView}
        />
      </div>
      <div className="flex flex-col flex-grow justify-between">
        {view === "history" ? (
          <div className="flex-grow overflow-auto mt-4">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 sticky top-0">
                <tr>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {withdrawalHistory.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {formatDate(new Date(tx.date).toISOString())}
                    </td>
                    <td className="p-3 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
                {withdrawalHistory.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No withdrawal history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : view === "chart" ? (
          <BalanceChart data={chartData} />
        ) : (
          <FormContainer
            methods={FormCtx}
            onSubmit={handleSubmit}
            className="flex flex-col flex-grow"
          >
            <SelectField
              name="bank"
              label="Bank"
              required
              options={bankListData}
            />
            <InputField
              name="amount"
              label="Amount"
              inputMode="number"
              required
              rules={{
                validate: (value: string) => {
                  const numeric = parseFloat(value);
                  if (isNaN(numeric)) return "Please enter a valid amount";
                  if (numeric <= 0) return "Amount must be greater than 0";

                  if (availableBalance < minRetainedBalance) {
                    return `Balance is below minimum limit of $${minRetainedBalance}`;
                  }
                  const maxWithdrawable = availableBalance - minRetainedBalance;
                  if (numeric > maxWithdrawable)
                    return `You must keep at least $${minRetainedBalance} in your account. Max withdrawable: $${maxWithdrawable}`;
                  return true;
                },
              }}
            />

            {/* ✅ Move the button inside the form */}
            <div className="mt-auto w-full">
              <Button
                className="w-full bg-teal-700 hover:bg-teal-800"
                type="submit"
              >
                Withdraw
              </Button>
            </div>
          </FormContainer>
        )}
      </div>
    </div>
  );
};

export default Withdraw;

const AvailableBalance = ({
  currentView,
  onViewChange,
}: {
  currentView: "form" | "history" | "chart";
  onViewChange: (view: "form" | "history" | "chart") => void;
}) => {
  return (
    <div className="bg-teal-700 p-4 flex flex-col justify-start rounded-md relative">
      <div className="text-gray-300">Available Withdrawal Balance</div>
      <div className="text-3xl font-bold text-gray-50">$1000</div>
      <div className="absolute top-4 right-4 flex gap-3">
        {currentView === "form" ? (
          <>
            <button
              onClick={() => onViewChange("chart")}
              className="text-white hover:text-teal-200 flex items-center gap-1 text-sm transition-colors"
              title="View Trend"
            >
              <HiChartBar className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewChange("history")}
              className="text-white hover:text-teal-200 flex items-center gap-1 text-sm transition-colors"
              title="View History"
            >
            <HiClock className="w-4 h-4" /> History
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewChange("form")}
            className="text-white hover:text-teal-200 flex items-center gap-1 text-sm transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (status === "Completed") colorClass = "bg-green-100 text-green-800";
  else if (status === "Pending") colorClass = "bg-yellow-100 text-yellow-800";
  else if (status === "Approved") colorClass = "bg-blue-100 text-blue-800";
  else if (status === "Failed") colorClass = "bg-red-100 text-red-800";

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
    >
      {status || "Unknown"}
    </span>
  );
};

const BalanceChart = ({ data }: { data: { date: Date; value: number }[] }) => {
  if (data.length === 0)
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        No data available for chart.
      </div>
    );

  const width = 600;
  const height = 300;
  const padding = 40;

  const minVal = Math.min(...data.map((d) => d.value));
  const maxVal = Math.max(...data.map((d) => d.value));
  const minDate = Math.min(...data.map((d) => d.date.getTime()));
  const maxDate = Math.max(...data.map((d) => d.date.getTime()));

  const getX = (date: Date) => {
    const percent = (date.getTime() - minDate) / (maxDate - minDate || 1);
    return padding + percent * (width - padding * 2);
  };

  const getY = (val: number) => {
    const percent = (val - minVal) / (maxVal - minVal || 1);
    return height - padding - percent * (height - padding * 2);
  };

  const points = data.map((d) => `${getX(d.date)},${getY(d.value)}`).join(" ");

  return (
    <div className="flex-grow flex flex-col mt-4 overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 px-2">Earnings Trend</h3>
      <div className="flex-grow overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[500px] min-h-[250px]">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
          <polyline fill="none" stroke="#0f766e" strokeWidth="2" points={points} />
          {data.map((d, i) => (
            <circle key={i} cx={getX(d.date)} cy={getY(d.value)} r="3" fill="#0f766e">
              <title>{d.date.toLocaleDateString()}: {formatCurrency(d.value)}</title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
};
