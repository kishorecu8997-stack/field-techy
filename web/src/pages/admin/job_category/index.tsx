import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";

interface BookedRequestCardProps {
  id: string;
  requestedBy: string;
  userName?: string;
  requestType: "pick" | "drop";
  status: string;
  deviceGoodCondition: string;
}

const columns: Column<BookedRequestCardProps>[] = [
  { key: "id", label: "Request ID" },
  {
    key: "requestedBy",
    label: "Employee",
    renderCell: (row: BookedRequestCardProps) => {
      const name = row.requestedBy || row.userName || "N/A";
      return <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>;
    },
  },
  {
    key: "requestType",
    label: "Request Type",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "deviceGoodCondition",
    label: "Condition",
  },
  {
    key: "action",
    label: "Actions",
    renderCell: (row: BookedRequestCardProps) => (
      <Button onClick={() => alert(`Viewing details for ${row.id}`)} />
    ),
  },
];

const data: BookedRequestCardProps[] = Array.from({ length: 23 }).map(
  (_, i) => ({
    id: `REQ-${i + 1}`,
    requestedBy: i % 2 === 0 ? "john" : "maria",
    requestType: i % 2 === 0 ? "pick" : "drop",
    status: i % 3 === 0 ? "Pending" : "Completed",
    deviceGoodCondition: i % 2 === 0 ? "Yes" : "No",
  })
);


const ManageJobCategory: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Booked Requests</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div><SearchInput/></div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<BookedRequestCardProps>
            columns={columns}
            data={data}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageJobCategory;

