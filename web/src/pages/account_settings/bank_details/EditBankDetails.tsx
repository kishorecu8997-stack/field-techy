import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import BankDetailsForm from "./BankDetailsForm";

const EditBankDetails = () => {
  const fromCtx = useForm({
    mode: "onChange",
    delayError: 500,
    defaultValues: {
      bankName: "Bank of America",
      accountNumber: "1234567890",
      swiftcode: "1234567890",
      bankAddress: "1234 Main Street, Anytown, USA",
      iban: "1234567890",
      name: "John Doe",
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
      <BankDetailsForm key="edit"/>
    </FormContainer>
  );
};

export default EditBankDetails;
