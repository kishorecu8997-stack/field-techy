import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";
import type { bankDetails } from "../types";
import { toast } from "react-toastify";
import { bankDetails as bankDetailsData } from "@/dummy_data/bankDetails";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Page component for editing existing bank details, pre-filled with default values using React Hook Form.
 */
const EditBankDetails = () => {
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const bankData = bankDetailsData.find(
    (bank) => bank.bankName === "Bank of America",
  );

  const formCtx = useForm<bankDetails>({
    mode: "onChange",
    delayError: 500,
    defaultValues: {
      bankName: bankData?.bankName,
      accountNumber: bankData?.accountNumber,
      swiftcode: bankData?.swiftcode,
      bankAddress: bankData?.bankAddress,
      iban: bankData?.iban,
      name: bankData?.name,
    },
  });

  const handleSubmit = async (data: bankDetails) => {
    await showPopup({
      title: "Edit Bank Details",
      body: "Are you sure you want to edit bank details?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "danger",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, Edit",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            close(true);
            toast.success("Bank Details updated successfully!");
            console.log("Submitted bank details:", data);
            setActiveKey("manageBankAccounts");
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <BankDetailsForm formType="edit" />
    </FormContainer>
  );
};

export default EditBankDetails;