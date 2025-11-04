import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";
import type { bankDetails } from "../types";

/**
 * Page component for editing existing bank details, pre-filled with default values using React Hook Form.
 */
const EditBankDetails = () => {
  const formCtx = useForm<bankDetails>({ // ✅ Typed correctly
    mode: "onChange",
    delayError: 500,
    defaultValues: {
      bankName: "",
      accountNumber: "",
      swiftcode: "",
      bankAddress: "",
      iban: "",
      name: "",
    },
  });

  const handleSubmit = (data: bankDetails) => {
    console.log("Submitted bank details:", data);
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
