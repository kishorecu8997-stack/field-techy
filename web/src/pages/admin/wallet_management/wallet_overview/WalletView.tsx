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

interface WalletViewProps {
  sno?: number;
  invoiceNumber: string;
  dateTime: string;
  transactionType: string;
  amount: string;
  paymentStatus: string;
  category: string;
  description: string;
}
/**
 * @component WalletView
 * @description Renders a detailed view of a specific client's wallet.
 * It fetches client details using the ID from the URL parameters and displays their profile information,
 * wallet balance, and a table of their transaction history.
 * @returns {JSX.Element} The rendered wallet details view component.
 */

export default function WalletView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const methods = useForm();

  const { data, isLoading } = useAdminGetManageTransactions(
    {},
    { enabled: true },
  );

  const selectedTransaction = useMemo(() => {
    if (!data || !id) return null;

    return data?.data?.find((tx) => tx.invoiceNumber === id);
  }, [data, id]);

  const { refetch: downloadInvoice } = useAdminDownloadInvoice(
    selectedTransaction?.id ?? 0,
    { enabled: false },
  );

  const handleDownload = async () => {
    const response = await downloadInvoice();

    if (response?.data) {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedTransaction?.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const tableData: WalletViewProps[] = useMemo(() => {
    if (!selectedTransaction) return [];

    return [
      {
        sno: 1,
        invoiceNumber: selectedTransaction.invoiceNumber,
        dateTime: new Date(selectedTransaction.timestamp).toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          },
        ),
        transactionType: selectedTransaction.transactionType,
        amount: selectedTransaction.amount,
        paymentStatus: selectedTransaction.paymentStatus,
        category: selectedTransaction.category,
        description: selectedTransaction.description,
      },
    ];
  }, [selectedTransaction]);

  const columns: Column<WalletViewProps>[] = [
    { key: "sno", label: "Sr.No." },
    { key: "invoiceNumber", label: "Invoice No" },
    { key: "dateTime", label: "Date & Time" },
    { key: "transactionType", label: "Transaction Type" },
    { key: "amount", label: "Amount" },
    { key: "paymentStatus", label: "Status" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
  ];

  if (isLoading) {
    return <LoaderComponent></LoaderComponent>;
  }

  if (!selectedTransaction) {
    return (
      <div className="p-8 text-center text-red-600">
        Transaction not found (Invoice: {id})
        <div className="mt-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-semibold">Transaction Details</h1>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <FormContainer methods={methods} className="flex flex-col gap-4">
          <div className="flex justify-between w-9/12 gap-8 my-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Client Name
              </label>
              <p className="font-semibold text-sm">
                {selectedTransaction.clientDetails?.name || "—"}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <p className="font-semibold text-sm">
                {selectedTransaction.clientDetails?.email || "—"}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <p className="font-semibold text-sm">
                {selectedTransaction.clientDetails?.phone || "—"}
              </p>
            </div>
          </div>
        </FormContainer>

        {/* ✅ Transaction Table */}
        <div className="mt-6">
          <CustomTable<WalletViewProps>
            columns={columns}
            data={tableData}
            initialPageSize={tableData.length}
            showPagination={false}
          />
        </div>

        {/* ✅ Download Button at Bottom (Better UX like before) */}
        <div className="flex justify-end mt-6">
          <Button variant="solid" onClick={handleDownload}>
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
