import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";
import type { bankDetails } from "../types";
import { toast } from "react-toastify";

interface AddBankDetailsProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}
/**
 * Page component for adding new bank details using a controlled form with React Hook Form.
 */
const AddBankDetails: React.FC<AddBankDetailsProps> = ({onMenuItemClick,onClose}) => {
  const fromCtx = useForm({
    mode:"onSubmit",
    defaultValues: {
      bankName: "",
      bankAddress: "",
      accountNumber: "",
      swiftcode: "",
      iban: "",
      name: "",
    },
  });
  const handleSubmit = (data: bankDetails) => {
    console.log(data);
    toast.success("Bank details added successfully");
   onMenuItemClick("manageBankAccounts");
  };
  return (
    <FormContainer
      methods={fromCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <BankDetailsForm formType="add"/>
    </FormContainer>
  );
};

export default AddBankDetails;
