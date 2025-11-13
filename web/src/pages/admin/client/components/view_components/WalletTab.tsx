import React from "react";
import { CustomTable, type Column } from "@/shared/components/commonUI/custom_table";
import type { walletViewData } from "../../types";
import BankCardDetail from "./BankCardDetail";
import { bankCardData, walletData} from "@/dummy_data/ClientViewData";

const WalletTab: React.FC = () => {
  const columns: Column<walletViewData>[] = [
    { key: "id", label: "Sr. NO" },
    { key: "dateTime", label: "Date & Time" },
    { key: "transactionType", label: "Transaction Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];
  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md">
      <div className="mb-2 flex justify-between items-center gap-2">
        <BankCardDetail {...bankCardData} />
      </div>
            <div className="h-full flex-1 overflow-y-auto ">
              <CustomTable<walletViewData>
                columns={columns}
                data={walletData}
                initialPageSize={10}
              />
            </div>
    </div>
  );
};

export default WalletTab;
