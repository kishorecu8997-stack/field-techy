import { bankListData } from "@/dummy_data/bankDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { SelectField } from "@/shared/components/commonUI/inputs/SelectField";
import { useForm } from "react-hook-form";
import type { bankDetails } from "../types";
import { toast } from "react-toastify";

interface WithdrawProps {
  onClose: () => void;
}
/**
 * Withdrawal form page displaying available balance and allowing users to select a bank and enter an amount.
 * Includes validation for numeric input and a submit button for initiating withdrawal.
 */
const Withdraw: React.FC<WithdrawProps> = ({ onClose }) => {
  const FormCtx = useForm<bankDetails>({
    mode: "onSubmit",
  });
  
const availableBalance = 1000;
  const handleSubmit = (data: bankDetails) => {
    console.log(data);
    toast.success("Withdrawal initiated successfully!");
    onClose();
  };



  return (
    <div className="flex flex-col h-full">
      <div className="h-28 flex-shrink-0">
        <AvailableBalance />
      </div>
      <div className="flex flex-col flex-grow justify-between">
        <FormContainer
          methods={FormCtx}
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow"
        >
          <SelectField
            name="bank"
            label="Bank"
            required
            options={bankListData}
          />
          <InputField
            name="amount"
            label="Amount"
            required
            rules={{
              validate: (value: string) => {
                const numeric = parseFloat(value);
                if (isNaN(numeric)) return "Please enter a valid amount";
                if (numeric > availableBalance) return `Amount cannot exceed available balance $${(availableBalance)}`;
                return true;
              },
            }}
          />

          {/* ✅ Move the button inside the form */}
          <div className="mt-auto w-full">
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800"
              type="submit"
            >
              Withdraw
            </Button>
          </div>
        </FormContainer>
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
