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

interface ClientWalletOverviewItem {
  userId?: number;
  clientId?: number;
  engineerId?: number;
  dateAndTime: string;
  amount: string;
  clientName?: string | null;
  mobileNo?: string | null;
  profileImageUrl?: string | null;
}

/**
 * @component ClientWallet
 * @description Renders the client wallet management page.
 * This page displays a table of clients, including their details and wallet balance.
 * It provides actions to navigate to a detailed view of a client's wallet or to delete a client.
 * @returns {JSX.Element} The rendered client wallet management component.
 */
const ClientWallet: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useAdminGetWalletOverview({
    usertype: "client",
    page,
    limit,
  });

  const items = useMemo<ClientWalletOverviewItem[]>(() => {
    return (data?.clientDetails ?? []).map((item) => ({
      ...item,
      userId: item.clientId ?? item.engineerId,
    }));
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;

    const term = search.toLowerCase().trim();

    return items.filter(
      (item) =>
        (item.clientName || "").toLowerCase().includes(term) ||
        (item.mobileNo || "").toLowerCase().includes(term) ||
        (item.amount || "").toLowerCase().includes(term),
    );
  }, [items, search]);

  const displayTotal = search.trim() ? filtered.length : (data?.total ?? 0);

  const parseAmount = (amountStr: string) => {
    const cleaned = amountStr.replace(/[^0-9.-]/g, "");
    const value = Number(cleaned) || 0;

    const symbolMatch = amountStr.match(/^[^0-9.]+/);
    const symbol = symbolMatch ? symbolMatch[0].trim() : "-";

    return { symbol, value };
  };

  const columns: Column<ClientWalletOverviewItem>[] = [
    {
      key: "sno",
      label: "Sr.No.",
      renderCell: (_row, index) => (page - 1) * limit + index + 1,
    },
    {
      key: "clientDetails",
      label: "Client Details",
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
            <div className="font-semibold">{row.clientName?.trim() || "—"}</div>

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
                clientName: row.clientName || undefined,
                mobileNo: row.mobileNo || undefined,
                usertype: "client",
              },
            },
          );
        };

        return (
          <div className="flex justify-center">
            <button
              className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
              onClick={handleView}
              title={`View wallet transactions for ${row.clientName}`}
              aria-label={`View wallet for ${row.clientName}`}
            >
              <FiEye className="text-yellow-600" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full w-full flex flex-col flex-1 overflow-hidden rounded-md gap-4">
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

export default ClientWallet;
