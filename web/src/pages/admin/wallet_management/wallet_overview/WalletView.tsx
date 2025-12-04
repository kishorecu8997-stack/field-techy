import { absoluteUrls } from "@/config/urls";
import {
  engineerData,
  WalletViewData,
  type WalletViewProps,
} from "@/dummy_data/admin";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

/**
 * @component WalletView
 * @description Renders a detailed view of a specific client's wallet.
 * It fetches client details using the ID from the URL parameters and displays their profile information,
 * wallet balance, and a table of their transaction history.
 * @returns {JSX.Element} The rendered wallet details view component.
 */
export default function WalletView() {
  const navigate = useNavigate();
  const methods = useForm();

  const { id } = useParams<{ id: string }>();

  // Find by ID (replace with real API call if needed)
  const walletDetails = engineerData.find((user) => user.sno.toString() === id);

  const columns: Column<WalletViewProps>[] = [
    { key: "sno", label: "Sr.No" },
    { key: "dateTime", label: "Date & Time" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "transactionType", label: "Transaction Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-semibold">Wallet Details</h1>
        <Button
          className="whitespace-nowrap bg-neutral-900 dark:bg-neutral-500"
          onClick={() => navigate(absoluteUrls.admin.home.wallet_overview)}
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <FormContainer methods={methods} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <ImageUploaderField
              name="profileImage"
              label="Image"
              allowUpload={false}
            />
          </div>
          <div className="flex justify-between w-9/12 gap-8 my-4">
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <p className="font-semibold text-sm">
                {walletDetails?.details?.name}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                Phone Number
              </label>
              <p className="font-semibold text-sm">
                {walletDetails?.details.phone || "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Wallet Balance
              </label>
              <p className="font-semibold text-sm">
                {walletDetails?.walletBalance}
              </p>
            </div>
          </div>
        </FormContainer>

        <div className="h-full overflow-y-auto">
          <CustomTable<WalletViewProps>
            columns={columns}
            data={WalletViewData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
