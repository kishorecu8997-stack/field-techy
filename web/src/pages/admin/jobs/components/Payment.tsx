/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentData } from "@/dummy_data/admin";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import CustomTable from "@/shared/components/commonUI/custom_table";
import SelectMenu from "@/shared/components/Temp";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import type { adminJobsStatus } from "../types";

const Payment = () => {
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const { showPopup } = usePopupStore();

  const handleStatusChange = async (data: any) => {
    if (!data.status) return;
    const status = data.status;
    await showPopup({
      title: `${status?.charAt(0).toUpperCase() + status?.slice(1)} Payment`,
      body: `Are you sure you want to ${
        status?.charAt(0).toUpperCase() + status?.slice(1)
      } this Payment?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: `${
            status.toLocaleLowerCase() === "approve" ? "primary" : "danger"
          }`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("close :", close);
            // await handlePostAJob(data);
            close(true);
          },
        },
      ],
    });
  };

  const columns = [
    { key: "id", label: "Payment ID" },
    { key: "amount", label: "Amount" },
    { key: "clientStatus", label: "Client Status" },
    {
      key: "adminStatus",
      label: "Admin Status",
      renderCell: (row: any) => {
        return (
          <div className="relative w-full">
            <SelectMenu
              placeholder="Select"
              value={rowStatuses[row.id] || ""}
              onChange={(value: string | null) => {
                setRowStatuses((prev) => ({
                  ...prev,
                  [row.id]: value ?? "",
                }));
                handleStatusChange({
                  ...row,
                  status: value as adminJobsStatus,
                });
              }}
              options={JobStatus}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div>
        <CustomTable<any>
          columns={columns}
          data={PaymentData}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default Payment;
