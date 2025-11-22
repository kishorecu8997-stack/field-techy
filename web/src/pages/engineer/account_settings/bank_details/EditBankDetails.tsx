import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";
import type { bankDetails } from "../types";
import { toast } from "react-toastify";
import { bankDetails as bankDetailsData } from "@/dummy_data/bankDetails";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * Page component for editing existing bank details, pre-filled with default values using React Hook Form.
 */
const EditBankDetails = () => {
  const bankData = bankDetailsData.find(
    (bank) => bank.bankName === "Bank of America"
  );

  const { showPopup } = usePopupStore();
  const formCtx = useForm<bankDetails>({
    // ✅ Typed correctly
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
      title: "Update Bank Details",
      body: "Are you sure you want to update this bank details?",
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "outline",
        },
        {
          label: "Yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            console.log("Submitted data:", data);
            toast.success("Bank details updated successfully");
            close(true);
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
