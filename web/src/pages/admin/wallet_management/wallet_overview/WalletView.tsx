import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useAdminGetManageTransactions,
  useAdminDownloadInvoice,
} from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";
import { formatApiDate } from "@/utils/timelineUtils";
import { FiDownload } from "react-icons/fi";
import {
  paymentStatusMap,
  transactionTypeMap,
  categoryMap,
} from "@/shared/constants/transactionMaps";

type TransactionType = NonNullable<
  ReturnType<typeof useAdminGetManageTransactions>["data"]
>["data"][number];

function InvoiceDownloadButton({
  transaction,
}: {
  transaction: TransactionType;
}) {
  const { refetch, isFetching } = useAdminDownloadInvoice(transaction.id ?? 0, {
    enabled: false,
  });

  const handleDownload = async () => {
    if (!transaction.id) {
      toast.error("No valid transaction ID");
      return;
    }

    try {
      const { data, error } = await refetch();

      if (error) throw error;
      if (!data) {
        toast.error("No invoice data received from server");
        return;
      }

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = transaction.invoiceNumber
        ? `${transaction.invoiceNumber}.pdf`
        : `transaction-${transaction.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to download invoice. Please try again.",
      );
    }
  };

  return (
    <FiDownload
      className={`h-5 w-5 cursor-pointer transition-colors ${
        isFetching
          ? "opacity-50 cursor-wait text-gray-400"
          : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      }`}
      onClick={isFetching ? undefined : handleDownload}
      title="Download Invoice"
    />
  );
}

export default function WalletView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const { usertype, userId, clientName, mobileNo } = (location.state || {}) as {
    usertype?: "client" | "engineer";
    userId?: number;
    clientName?: string;
    mobileNo?: string;
  };

  const methods = useForm();

  const { data, isLoading: isTransactionsLoading } =
    useAdminGetManageTransactions({ limit: 9999 }, { enabled: true });

  const userTransactions = useMemo<TransactionType[]>(() => {
    if (!data?.data || !userId) return [];

    return data.data.filter((tx) => {
      if (usertype === "client") {
        return tx.clientId === userId;
      }

      if (usertype === "engineer") {
        return tx.engineerId === userId;
      }

      return false;
    });
  }, [data?.data, userId, usertype]);

  const hasTransactions = userTransactions.length > 0;

  const columns: Column<TransactionType>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row, index) => index + 1,
    },
    {
      key: "invoiceNumber",
      label: "Invoice No",
      renderCell: (row) => row.invoiceNumber || "—",
    },
    {
      key: "timestamp",
      label: "Date & Time",
      renderCell: (row) => (
        <span className="whitespace-nowrap">
          {row.timestamp ? formatApiDate(row.timestamp) : "—"}
        </span>
      ),
    },
    {
      key: "transactionType",
      label: "Transaction Type",
      renderCell: (row) =>
        transactionTypeMap[row.transactionType] ?? row.transactionType ?? "—",
    },
    {
      key: "amount",
      label: "Amount",
      renderCell: (row) => row.amount || "—",
    },
    {
      key: "paymentStatus",
      label: "Status",
      renderCell: (row) =>
        paymentStatusMap[row.paymentStatus] ?? row.paymentStatus ?? "—",
    },
    {
      key: "category",
      label: "Category",
      renderCell: (row) => categoryMap[row.category] ?? row.category ?? "—",
    },
    {
      key: "description",
      label: "Description",
      renderCell: (row) => row.description ?? "—",
    },
    {
      label: "Action",
      renderCell: (row) => <InvoiceDownloadButton transaction={row} />,
    },
  ];

  if (isTransactionsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Wallet Transactions</h1>

        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {hasTransactions ? (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
          <FormContainer methods={methods} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <p className="font-medium">
                  {userTransactions[0]?.clientDetails?.name ||
                    clientName ||
                    "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Email
                </label>
                <p className="font-medium">
                  {userTransactions[0]?.clientDetails?.email || "—"}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Phone
                </label>
                <p className="font-medium">
                  {userTransactions[0]?.clientDetails?.phone || mobileNo || "—"}
                </p>
              </div>
            </div>
          </FormContainer>

          <CustomTable<TransactionType>
            columns={columns}
            data={userTransactions}
            initialPageSize={10}
            totalCount={userTransactions.length}
            loading={false}
          />
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-gray-700 rounded-lg shadow-sm">
          <div className="text-xl font-semibold text-amber-600 mb-4">
            No transactions found
          </div>

          <div className="text-gray-600 mb-2">
            No matching records for user ID <strong>{userId}</strong>
          </div>

          <Button variant="solid" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
}
