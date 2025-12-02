import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";
import type { bankDetails } from "../types";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Page component for adding new bank details using a controlled form with React Hook Form.
 */
const AddBankDetails = () => {
  const fromCtx = useForm({
    mode: "onSubmit",
    defaultValues: {
      bankName: "",
      bankAddress: "",
      accountNumber: "",
      swiftcode: "",
      iban: "",
      name: "",
    },
  });
  const { showPopup } = usePopupStore();
  const { setActiveKey } = useDrawerStore();

  const handleSubmit = async (data: bankDetails) => {
    await showPopup({
      title: " Add Bank Details",
      body: "Are you sure you want to Add Bank Details?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, Add",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Bank Details added Successfully");
            close(true);
            setActiveKey("settings");
          },
        },
      ],
    });   
  };
  return (
    <FormContainer
      methods={fromCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <BankDetailsForm formType="add" />
    </FormContainer>
  );
};

export default AddBankDetails;
