import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";

const AddBankDetails = ({}:{}) => {
  const fromCtx = useForm({
    mode:"onChange",
    defaultValues: {
      bankName: "",
      accountNumber: "",
      swiftcode: "",
      bankAddress: "",
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
