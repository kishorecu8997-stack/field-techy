import { transactions } from "@/dummy_data/admin/Transaction";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import type { TransactionProps } from "./types";

/**
 * EngineerPayout Component
 *
 * Renders a table of engineer payment transactions with client info, job details, and actions.
 * @returns {JSX.Element} The engineer payout management view.
 */
const EngineerPayout: React.FC = () => {
  const columns: Column<TransactionProps>[] = [
    {
      key: "id",
      label: "Transaction ID",
      renderCell: (row: TransactionProps) => (
        <div className="text-nowrap w-full">{row.transactionId}</div>
      ),
    },
    {
      key: "clientDetails",
      label: "Client Details",
      renderCell: (row: TransactionProps) => (
        <div className="flex items-center gap-2">
          <div>
            <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div>
            <div className="font-semibold">{row.clientDetails.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.clientDetails.email}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.clientDetails.phone}
            </div>
          </div>
        </div>
      ),
    },
    { key: "jobTitle", label: "Job Title" },
    {
      key: "jobDescription",
      label: "Job Description",
      renderCell: (row: TransactionProps) => (
        <div className="text-sm w-70 ">{row.jobDescription}</div>
      ),
    },
    { key: "amount", label: "Amount" },
    {
      key: "engineerDetails",
      label: "Engineer Details",
      renderCell: (row: TransactionProps) => (
        <div className="flex items-center gap-2">
          <div>
            <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div>
            <div className="font-semibold">{row.engineerDetails.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.engineerDetails.email}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.engineerDetails.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      renderCell: (row: TransactionProps) => (
        <div className="whitespace-nowrap">
          {row.paymentStatus.charAt(0).toUpperCase() +
            row.paymentStatus.slice(1)}
        </div>
      ),
    },
    {
      key: "action",
      label: "Download Invoice",
      renderCell: (row: TransactionProps) => (
        <div className="flex items-center gap-2 justify-center">
          <FiDownload className="text-emerald-600 hover:text-emerald-700" />
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <div className=" h-full w-full flex flex-1 overflow-y-auto flex-col gap-2">
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<TransactionProps>
            columns={columns}
            data={transactions}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default EngineerPayout;
