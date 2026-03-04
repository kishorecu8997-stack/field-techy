import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useAdminGetManageTransactions,
  useAdminDownloadInvoice,
} from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";

export default function WalletView() {
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const methods = useForm();

  const { data, isLoading: isTransactionsLoading } =
    useAdminGetManageTransactions({ limit: 9999 }, { enabled: !!idParam });

  type TransactionType = NonNullable<typeof data>["data"][number];

  const selectedTransaction = useMemo(() => {
    if (!data?.data || !idParam) return null;

    const numericParam = Number(idParam);

    let transaction = data.data.find((item) => item.invoiceNumber === idParam);

    if (
      !transaction &&
      !isNaN(numericParam) &&
      Number.isInteger(numericParam) &&
      numericParam > 0
    ) {
      transaction = data.data.find((item) => item.id === numericParam);
    }

    if (!transaction && idParam.toUpperCase().startsWith("INV-")) {
      const extractedId = Number(
        idParam.toUpperCase().replace("INV-", "").trim(),
      );

      if (
        !isNaN(extractedId) &&
        Number.isInteger(extractedId) &&
        extractedId > 0
      ) {
        transaction = data.data.find((item) => item.id === extractedId);
      }
    }

    return transaction ?? null;
  }, [data?.data, idParam]);

  const { refetch: downloadInvoice, isFetching: isDownloading } =
    useAdminDownloadInvoice(selectedTransaction?.id ?? 0, {
      enabled: false,
    });

  const handleDownload = async () => {
    if (!selectedTransaction?.id) {
      toast.error("No transaction selected for download");
      return;
    }

    try {
      const response = await downloadInvoice();

      if (!response?.data) {
        toast.error("No invoice data received from server");
        return;
      }

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = selectedTransaction.invoiceNumber
        ? `${selectedTransaction.invoiceNumber}.pdf`
        : `transaction-${selectedTransaction.id}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to download invoice. Please try again.",
      );
    }
  };

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
      renderCell: (row) => {
        const safeTimestamp = row.timestamp ?? new Date().toISOString();

        return new Date(safeTimestamp).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      key: "transactionType",
      label: "Transaction Type",
      renderCell: (row) => row.transactionType || "—",
    },
    {
      key: "amount",
      label: "Amount",
      renderCell: (row) => row.amount || "—",
    },
    {
      key: "paymentStatus",
      label: "Status",
      renderCell: (row) => row.paymentStatus || "—",
    },
    {
      key: "category",
      label: "Category",
      renderCell: (row) => row.category || "—",
    },
    {
      key: "description",
      label: "Description",
      renderCell: (row) => row.description ?? "—",
    },
  ];

  if (isTransactionsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <LoaderComponent />
      </div>
    );
  }

  if (!selectedTransaction) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl font-semibold text-red-600 mb-4">
          Transaction not found
        </div>
        <div className="text-gray-600 mb-6">
          No transaction matches ID/Invoice: <strong>{idParam}</strong>
        </div>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Transaction Details</h1>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
        <FormContainer methods={methods} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <p className="font-medium">
                {selectedTransaction.clientDetails?.name || "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <p className="font-medium">
                {selectedTransaction.clientDetails?.email || "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <p className="font-medium">
                {selectedTransaction.clientDetails?.phone || "—"}
              </p>
            </div>
          </div>
        </FormContainer>

        <div className="mb-8">
          <CustomTable<TransactionType>
            columns={columns}
            data={[selectedTransaction]}
            initialPageSize={1}
            showPagination={false}
            loading={false}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="solid"
            onClick={handleDownload}
            disabled={isDownloading}
            className={isDownloading ? "opacity-70 cursor-wait" : ""}
          >
            {isDownloading ? "Downloading..." : "Download Invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
}
