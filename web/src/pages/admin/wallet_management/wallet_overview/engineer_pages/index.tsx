import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { absoluteUrls } from "@/config/urls";
import { useAdminGetWalletOverview } from "@/shared/apiServices/admin/adminOpenApiService";

interface EngineerWalletOverviewItem {
  userId?: number;
  engineerId?: number;

  dateAndTime: string;
  amount: string;

  engineerName?: string | null;
  mobileNo?: string | null;
  profileImageUrl?: string | null;
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

  const { data, isLoading } = useAdminGetWalletOverview({
    usertype: "engineer",
    page,
    limit,
  });

  const items = useMemo<EngineerWalletOverviewItem[]>(() => {
    return (data?.engineerDetails ?? []).map((item) => ({
      ...item,
      userId: item.engineerId,
      engineerName: item.clientName,
    }));
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;

    const term = search.toLowerCase().trim();

    return items.filter(
      (item) =>
        (item.engineerName || "").toLowerCase().includes(term) ||
        (item.mobileNo || "").toLowerCase().includes(term) ||
        (item.amount || "").toLowerCase().includes(term),
    );
  }, [items, search]);

  const displayTotal = search.trim() ? filtered.length : (data?.total ?? 0);

  const parseAmount = (amountStr?: string | null) => {
    const safeAmount = amountStr ?? "";

    const cleaned = safeAmount.replace(/[^0-9.-]/g, "");
    const value = Number(cleaned) || 0;

    const symbolMatch = safeAmount.match(/^[^0-9.]+/);
    const symbol = symbolMatch ? symbolMatch[0].trim() : "-";

    return { symbol, value };
  };

  const columns: Column<EngineerWalletOverviewItem>[] = [
    {
      key: "sno",
      label: "Sr.No.",
      renderCell: (_row, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "engineerDetails",
      label: "Engineer Details",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <div>
            {row.profileImageUrl ? (
              <img
                src={row.profileImageUrl}
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            )}
          </div>

          <div>
            <div className="font-semibold">
              {row.engineerName?.trim() || "—"}
            </div>

            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.mobileNo || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
      renderCell: (row) => {
        const { symbol, value } = parseAmount(row.amount);

        return (
          <span className="font-medium">
            {symbol}{" "}
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
      align: "center",
      renderCell: (row) => {
        if (!row.userId) {
          return (
            <div className="flex justify-center">
              <div
                className="p-2 bg-gray-100 rounded-md cursor-not-allowed opacity-50"
                title="User ID missing – cannot view details"
              >
                <FiEye className="text-gray-500" />
              </div>
            </div>
          );
        }

        const handleView = () => {
          navigate(
            `${absoluteUrls.admin.home.wallet_overview_view}/${row.userId}`,
            {
              state: {
                userId: row.userId,
                clientName: row.engineerName || undefined,
                mobileNo: row.mobileNo || undefined,
                usertype: "engineer",
              },
            },
          );
        };

        return (
          <div className="flex justify-center">
            <button
              className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
              onClick={handleView}
              title={`View wallet transactions for ${row.engineerName}`}
              aria-label={`View wallet for ${row.engineerName}`}
            >
              <FiEye className="text-yellow-600" />
            </button>
          </div>
        );
      },
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
