import { options, PaymentData } from "@/dummy_data/admin";
import StateCard from "@/shared/components/AdminCard";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import SelectMenu from "@/shared/components/SelectMenu";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import type { PaymentProps } from "./types";

/**
 * ManagePayment Component
 *
 * Renders a management dashboard for payment transactions.
 * Displays payment details in a searchable and paginated table, allowing admins to:
 * - View client and engineer details
 * - Track job-related payment statuses
 * - Send or process payments manually
 *
 * @component
 * @example
 * return (
 *   <ManagePayment />
 * );
 *
 * @returns {JSX.Element} The rendered ManagePayment component.
 */
const ManagePayment: React.FC = () => {
  const columns: Column<PaymentProps>[] = [
    { key: "id", label: "Payment ID" },
    { key: "clientDetails", label: "Client Details" },
    { key: "jobTitle", label: "Job Title" },
    { key: "jobDescription", label: "Job Description" },
    { key: "amount", label: "Amount" },
    { key: "engineerDetails", label: "Engineer Details" },
    {
      key: "clientStatus",
      label: "Client Status",
      renderCell: (row: PaymentProps) => (
        <div>
          {row.clientStatus.charAt(0).toUpperCase() + row.clientStatus.slice(1)}
        </div>
      ),
    },
    {
      key: "adminStatus",
      label: "Admin Status",
      renderCell: (row: PaymentProps) => <AdminStatus row={row.adminStatus} />,
    },

    {
      key: "action",
      label: "Payment",
      renderCell: (row: PaymentProps) => (
        <div className="flex items-center gap-2">
          <Button className="whitespace-nowrap bg-emerald-900" onClick={()=>console.log('send payout')}>
            Send Payout
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold ">Manage Payments</h1>
        <Button className="whitespace-nowrap bg-neutral-900 dark:bg-neutral-500" onClick={()=>console.log('export csv')}>
          Export CSV
        </Button>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div className="max-w-80">
          <StateCard title="Total Payment" value={5000} />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<PaymentProps>
            columns={columns}
            data={PaymentData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagePayment;

const AdminStatus = ({ row }: { row: string }) => {

  const [status, setStatus] = useState<string>(row);

  const handleChangeStatus = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="text-sm ">
      <SelectMenu
        placeholder="Select Status"
        className="w-36"
        options={options}
        value={status}
        onChange={() => handleChangeStatus(row)}
      />
    </div>
  );
};
