import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { useForm } from "react-hook-form";

/**
 * Withdrawal form page displaying available balance and allowing users to select a bank and enter an amount.
 * Includes validation for numeric input and a submit button for initiating withdrawal.
 */
const Withdraw = () => {
  const FormCtx = useForm();
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
  <div className="flex flex-col h-full">
    <div className="h-28 flex-shrink-0">
      <AvailableBalance />
    </div>
    <div className="flex flex-col flex-grow justify-between">
      <FormContainer methods={FormCtx} onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <SelectField
          name="bank"
          label="Bank"
          required
          options={[
            { value: "SBI", label: "SBI" },
            { value: "ICICI", label: "ICICI" },
          ]}
        />
        <InputField
          name="amount"
          label="Amount"
          required
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: "Please enter a valid amount",
            },
          }}
        />
      </FormContainer>
      <div className="self-end mt-auto w-full">
        <Button className="w-full bg-teal-700 hover:bg-teal-800" type="submit">Withdraw</Button>
      </div>
    </div>
  </div>
);
};

export default Withdraw;

const AvailableBalance = () => {
  return (
    <div className="bg-teal-700 p-4 flex flex-col justify-start rounded-md">
      <div className="text-gray-300">Available Withdrawal Balance</div>
      <div className="text-3xl font-bold text-gray-50">$1000</div>
    </div>
  );
};
