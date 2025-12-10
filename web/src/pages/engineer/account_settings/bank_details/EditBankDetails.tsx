import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";
import type { bankDetails } from "../types";
import { toast } from "react-toastify";
import { bankDetails as bankDetailsData } from "@/dummy_data/bankDetails";

interface EditBankDetailsProps {
  onMenuItemClick: (key: string) => void;
}
/**
 * Page component for editing existing bank details, pre-filled with default values using React Hook Form.
 */

  const EditBankDetails: React.FC<EditBankDetailsProps> = ({ onMenuItemClick }) => {
  const bankData = bankDetailsData.find(
    (bank) => bank.bankName === "Bank of America"
  );

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

  const handleSubmit = (data: bankDetails) => {
    console.log("Submitted bank details:", data);
    toast.success("Bank details updated successfully");
    onMenuItemClick("manageBankAccounts");
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
