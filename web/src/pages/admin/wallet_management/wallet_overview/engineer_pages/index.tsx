import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { absoluteUrls } from "@/config/urls";
import React, { useState, useMemo } from "react";
import { useAdminGetWalletOverview } from "@/shared/apiServices/admin/adminOpenApiService";

interface WalletTransaction {
  profileImageUrl: string | null;
  mobileNo: string | null;
  clientName: string | null;
  transactionId: string;
  transactionType: "credit" | "debit";
  amount: string;
}
/**
 * Engineer Component
 *
 * Renders a table of engineer payment transactions with client info, job details, and actions.
 * @returns {JSX.Element} The engineer management view.
 */

const EngineerWallet: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useAdminGetWalletOverview(
    {
      usertype: "engineer",
      page,
      limit,
    },
    {},
  );

  const parseAmount = (amountStr: string | null | undefined) => {
    if (!amountStr) return { symbol: "₹", value: 0 };

    const match = amountStr.match(/^([^0-9]*)([\d,]+\.?\d*)$/);

    if (match) {
      const [, symbol, numPart] = match;
      const cleanNum = numPart.replace(/,/g, "");
      return {
        symbol: symbol.trim() || "₹",
        value: Number(cleanNum) || 0,
      };
    }

    const cleaned = amountStr.replace(/[^0-9.]/g, "");
    return {
      symbol: "₹",
      value: Number(cleaned) || 0,
    };
  };

  const filtered = useMemo(() => {
    const items = data?.engineerDetails ?? [];

    if (!search.trim()) return items;

    const term = search.toLowerCase().trim();

    return items.filter(
      (tx: WalletTransaction) =>
        tx.clientName?.toLowerCase().includes(term) ||
        tx.mobileNo?.toLowerCase().includes(term) ||
        tx.amount?.toLowerCase().includes(term) ||
        tx.transactionId?.toLowerCase().includes(term),
    );
  }, [data?.engineerDetails, search]);

  const displayTotal = search.trim() ? filtered.length : (data?.total ?? 0);

  const columns: Column<WalletTransaction>[] = [
    {
      key: "sno",
      label: "Sr.No.",
      renderCell: (_row: WalletTransaction, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      key: "engineerDetails",
      label: "Engineer Details",
      renderCell: (row: WalletTransaction) => (
        <div className="flex items-center gap-2">
          <div>
            {row.profileImageUrl ? (
              <img
                src={row.profileImageUrl}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            )}
          </div>
          <div>
            <div className="font-semibold">{row.clientName || "—"}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.mobileNo || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      renderCell: (row: WalletTransaction) => {
        const { symbol, value } = parseAmount(row.amount);

        return (
          <span
            className={
              row.transactionType === "credit"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {row.transactionType === "credit" ? "+" : "−"}
            {symbol} {""}
            {value.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      align: "center" as const,
      renderCell: (row: WalletTransaction) => (
        <div className="flex items-center justify-center gap-2">
          <div
            className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md cursor-pointer transition-colors"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.wallet_overview_view}/${row.transactionId}`,
                {
                  state: {
                    transactionId: row.transactionId,
                    usertype: "engineer",
                  },
                },
              )
            }
          >
            <FiEye className="text-yellow-600" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full w-full flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-md p-4 gap-4">
      <div className="flex justify-between items-center gap-4">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="flex-1 overflow-hidden">
        <CustomTable
          columns={columns}
          data={filtered}
          initialPageSize={limit}
          totalCount={displayTotal}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default EngineerWallet;
