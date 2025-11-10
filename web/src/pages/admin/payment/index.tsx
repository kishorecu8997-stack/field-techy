import { PaymentData } from "@/dummy_data/admin";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";

export interface PaymentProps {
  id: string;
  clientDetails: string;
  jobTitle: string;
  jobDescription: string;
  amount: string;
  engineerDetails: string;
  clientStatus: string;
  adminStatus: string;
}


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
    { key: "id", label: "Request ID" },
    { key: "clientDetails", label: "Client Details" },
    { key: "jobTitle", label: "Job Title" },
    { key: "jobDescription", label: "Job Description" },
    { key: "amount", label: "Amount" },
    { key: "engineerDetails", label: "Engineer Details" },
    { key: "clientStatus", label: "Client Status" },
    { key: "adminStatus", label: "Admin Status" },

    {
      key: "action",
      label: "Payment",
      renderCell: (row: PaymentProps) => (
        <div className="flex items-center gap-2">
          <Button className="whitespace-nowrap">Send Payment</Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Manage Rate Cards</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
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
