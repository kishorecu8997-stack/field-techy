import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";


/**
 * Page component for adding new bank details using a controlled form with React Hook Form.
 */
const AddBankDetails = ({}:{}) => {
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
  const handleSubmit = (data: any) => {
    console.log(data);
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
