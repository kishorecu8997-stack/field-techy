import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, { type Column } from "@/shared/components/commonUI/custom_table";
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

interface TransactionRow {
  sno: number;
  invoiceNumber: string;
  dateTime: string;
  transactionType: string;
  amount: string;
  paymentStatus: string;
  category: string;
  description: string | null;
}

/**
 * @component WalletView
 * @description Renders a detailed view of a specific transaction.
 * Fetches transactions and finds the one matching the URL parameter (id or invoice number).
 * Displays transaction details and allows invoice download.
 * @returns {JSX.Element} The rendered transaction details view
 */
export default function WalletView() {
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const methods = useForm();

  const { data, isLoading: isTransactionsLoading } = useAdminGetManageTransactions(
    { limit: 9999 },
    { enabled: !!idParam },
  );

  const selectedTransaction = useMemo(() => {
    if (!data?.data || !idParam) return null;

    const numFromParam = Number(idParam);

   
    let tx = data.data.find((t) => t.invoiceNumber === idParam);

 
    if (
      !tx &&
      !isNaN(numFromParam) &&
      Number.isInteger(numFromParam) &&
      numFromParam > 0
    ) {
      tx = data.data.find((t) => t.id === numFromParam);
    }

    if (!tx && idParam.toUpperCase().startsWith("INV-")) {
      const possibleIdStr = idParam.toUpperCase().replace("INV-", "").trim();
      const possibleId = Number(possibleIdStr);
      if (!isNaN(possibleId) && Number.isInteger(possibleId) && possibleId > 0) {
        tx = data.data.find((t) => t.id === possibleId);
      }
    }

    return tx ?? null;
  }, [data?.data, idParam]);

  const {
    refetch: downloadInvoice,
    isFetching: isDownloading,
  } = useAdminDownloadInvoice(selectedTransaction?.id ?? 0, {
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

    const blob = new Blob([response.data], { type: "application/pdf" });
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
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to download invoice. Please try again.");
    }
  }
};
  const columns: Column<TransactionRow>[] = [
    {
      key: "sno",
      label: "Sr.No.",
      renderCell: () => 1, 
    },
    {
      key: "invoiceNumber",
      label: "Invoice No",
      renderCell: (row) => row.invoiceNumber || "—",
    },
    {
      key: "dateTime",
      label: "Date & Time",
      renderCell: (row) => row.dateTime,
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
      renderCell: (row) => row.description || "—",
    },
  ];

  const tableData = useMemo<TransactionRow[]>(() => {
    if (!selectedTransaction) return [];

    const safeTimestamp = selectedTransaction.timestamp ?? new Date().toISOString();
    const formattedDate = new Date(safeTimestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return [
      {
        sno: 1,
        invoiceNumber: selectedTransaction.invoiceNumber || "—",
        dateTime: formattedDate,
        transactionType: selectedTransaction.transactionType || "—",
        amount: selectedTransaction.amount || "—",
        paymentStatus: selectedTransaction.paymentStatus || "—",
        category: selectedTransaction.category || "—",
        description: selectedTransaction.description ?? "—",
      },
    ];
  }, [selectedTransaction]);


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
        {/* Client Information */}
        <FormContainer methods={methods} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                 Name
              </label>
              <p className="font-medium">
                {selectedTransaction.clientDetails?.name || "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="font-medium">
                {selectedTransaction.clientDetails?.email || "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </label>
              <p className="font-medium">
                {selectedTransaction.clientDetails?.phone || "—"}
              </p>
            </div>
          </div>
        </FormContainer>

        {/* Transaction Table */}
        <div className="mb-8">
          <CustomTable<TransactionRow>
            columns={columns}
            data={tableData}
            initialPageSize={1}
            showPagination={false}
            loading={false}
          />
        </div>

        {/* Download Button */}
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