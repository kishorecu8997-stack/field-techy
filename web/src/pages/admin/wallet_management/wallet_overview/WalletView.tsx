import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAdminGetManageTransactions,
  useAdminDownloadInvoice,
} from "@/shared/apiServices/admin/adminOpenApiService";

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
      role="button"
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
  const location = useLocation();
  const { id: urlUserId } = useParams();
  const [searchParams] = useSearchParams();

  const urlType = searchParams.get("type");

  let parsedUrlUserId = urlUserId;
  if (urlUserId?.startsWith("userId=")) {
    parsedUrlUserId = urlUserId.split("=")[1];
  }

  const { usertype, userId: stateUserId, clientName, mobileNo, email } = (location.state ||
    {}) as {
    usertype?: "client" | "engineer";
    userId?: number;
    clientName?: string;
    mobileNo?: string;
    email?: string;
  };

  const finalUserId = Number(parsedUrlUserId) || stateUserId;
  const finalUserType = (urlType as "client" | "engineer") || usertype;

  const methods = useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const transactionsQuery = useAdminGetManageTransactions({
    page,
    limit,
    ...(finalUserType === "client" && finalUserId ? { clientId: finalUserId } : {}),
    ...(finalUserType === "engineer" && finalUserId ? { engineerId: finalUserId } : {}),
  });

  const { data: manageTransactionsData, isLoading: isTransactionsLoading } = transactionsQuery;

  const transactions = manageTransactionsData?.data || [];
  const totalCount = manageTransactionsData?.total || 0;

  const columns: Column<TransactionType>[] = [
    {
      key: "srNo",
      label: "Sr.No.",
      renderCell: (_row, index) => (page - 1) * limit + index + 1,
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
      key: "action",
      label: "Action",
      renderCell: (row) => <InvoiceDownloadButton transaction={row} />,
    },
  ];

  return (
    <div className="h-full w-full flex flex-1 overflow-hidden flex-col bg-gray-50 dark:bg-gray-800 rounded-md p-4 md:p-6">
      <div className="flex justify-between items-center mb-4 gap-2">
        <h1 className="text-xl font-semibold">Wallet Transactions</h1>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4">
        <FormContainer methods={methods} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <p className="font-medium">
                {clientName ||
                  transactions.find(
                    (t) => t.clientDetails?.name || t.engineerDetails?.name,
                  )?.clientDetails?.name ||
                  transactions.find((t) => t.engineerDetails?.name)
                    ?.engineerDetails?.name ||
                  "—"}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <p className="font-medium">
                {email ||
                  transactions.find(
                    (t) => t.clientDetails?.email || t.engineerDetails?.email,
                  )?.clientDetails?.email ||
                  transactions.find((t) => t.engineerDetails?.email)
                    ?.engineerDetails?.email ||
                  "—"}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <p className="font-medium">
                {mobileNo ||
                  transactions.find(
                    (t) => t.clientDetails?.phone || t.engineerDetails?.phone,
                  )?.clientDetails?.phone ||
                  transactions.find((t) => t.engineerDetails?.phone)
                    ?.engineerDetails?.phone ||
                  "—"}
              </p>
            </div>
          </div>
        </FormContainer>

        <div className="h-full flex-1 overflow-hidden">
          <CustomTable<TransactionType>
            columns={columns}
            data={transactions}
            initialPageSize={limit}
            totalCount={totalCount}
            currentPage={page}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
            loading={isTransactionsLoading}
          />
        </div>
      </div>
    </div>
  );
}
