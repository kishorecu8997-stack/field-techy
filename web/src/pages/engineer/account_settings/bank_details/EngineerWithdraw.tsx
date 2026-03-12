import { useRequestWithdrawal } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { formatCurrency } from "@/shared/libs/utils";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { BsInfoCircle } from "react-icons/bs";
import Tooltip from "@/shared/components/commonUI/Tooltip";

interface ClientWithdrawProps {
  balance: number;
  currencyCode: string;
  onClose: () => void;
  refetch?: () => void;
}

interface IWithdrawForm {
  amount: string;
}

const EngineerWithdraw: React.FC<ClientWithdrawProps> = ({
  balance,
  currencyCode,
  onClose,
  refetch,
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

  const {
    mutateAsync: requestWithdrawalAsync,
    isPending: isRequestingWithdrawal,
  } = useRequestWithdrawal();

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

  const onConfirmWithdraw = async () => {
    const numericAmount = parseFloat(amount);
    try {
      await requestWithdrawalAsync({
        body: {
          amount: numericAmount,
          currency: currencyCode,
        },
      });
      setIsConfirming(false);
      refetch?.();
      onClose();
      toast.success("Withdrawal request raised successfully.");
    } catch (error) {
      console.error("Failed to raise withdrawal request:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <IoMdClose size={24} />
        </button>
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
              <Button
                variant="primary"
                onClick={onConfirmWithdraw}
                disabled={isRequestingWithdrawal}
              >
                {isRequestingWithdrawal ? "Confirming..." : "Confirm"}
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
                type="text"
                allowedCharacters="numbers-dot"
                rules={{
                  required: "Amount is required.",
                  validate: (value) => {
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      return "Amount can have at most two decimal places.";
                    }
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
            <div className="flex justify-end items-center gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleSubmit(handleRaiseRequest)}
                  disabled={!isValid || !isDirty}
                >
                  Raise Payment Request
                </Button>
                <Tooltip text="Click “Raise Payment Request” to notify the admin that you have submitted a payment transfer request.">
                  <BsInfoCircle className="cursor-pointer" />
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default EngineerWithdraw;
