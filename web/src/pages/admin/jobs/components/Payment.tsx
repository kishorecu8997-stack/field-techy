import { PaymentData } from "@/dummy_data/admin";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import CustomTable from "@/shared/components/commonUI/custom_table";
import SelectMenu from "@/shared/components/SelectMenu";
import { useState } from "react";

const Payment = () => {
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
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
