import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { formatCurrency } from "@/shared/libs/utils";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface ClientWithdrawProps {
  balance: number;
  currencyCode: string;
  onClose: () => void;
}

interface IWithdrawForm {
  amount: string;
}

const ClientWithdraw: React.FC<ClientWithdrawProps> = ({
  balance,
  currencyCode,
  onClose,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const methods = useForm<IWithdrawForm>({
    defaultValues: { amount: "" },
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = methods;
  const amount = watch("amount");

  const handleRaiseRequest = (data: IWithdrawForm) => {
    const numericAmount = parseFloat(data.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0.");
      return;
    }
    if (numericAmount > balance) {
      toast.error("Withdrawal amount cannot be greater than your balance.");
      return;
    }
    setIsConfirming(true);
  };

  const onConfirmWithdraw = () => {
    const numericAmount = parseFloat(amount);
    console.log({
      amount: numericAmount,
      currencyCode: currencyCode,
    });
    setIsConfirming(false);
    onClose();
    toast.success("Withdrawal request raised successfully.");
  };

  return (
    <FormProvider {...methods}>
      <div className="p-4">
        {isConfirming ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
              Confirm Withdrawal
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to raise a withdraw request for{" "}
              <span className="font-semibold">
                {formatCurrency(parseFloat(amount), currencyCode)}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setIsConfirming(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onConfirmWithdraw}>
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
              Withdraw Fund
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Available balance:{" "}
              <span className="font-semibold">
                {formatCurrency(balance, currencyCode)}
              </span>
            </p>
            <div className="mb-4">
              <InputField
                name="amount"
                label="Amount to withdraw"
                placeholder="Enter amount"
                type="number"
                allowedCharacters="numbers-dot"
                rules={{
                  required: "Amount is required.",
                  validate: (value) => {
                    const numericValue = parseFloat(value);
                    if (numericValue <= 0) {
                      return "Amount must be greater than 0.";
                    }
                    if (numericValue > balance) {
                      return "Amount cannot exceed the available balance.";
                    }
                    return true;
                  },
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit(handleRaiseRequest)}
                disabled={!isValid || !isDirty}
              >
                Raise Payment Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default ClientWithdraw;
