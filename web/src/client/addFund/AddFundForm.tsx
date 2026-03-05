
import {
  useClientBalance,
  useCreatePaymentIntent,
} from "@/shared/apiServices/client/clientOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useToast } from "@/shared/components/commonUI/toastContext.tsx";
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface AddFundFormProps {
  onClose: () => void;
}

/*
* TODO: implement add fund form
* Add fund form will be used to add funds to the client's wallet
* this form will call the create payment intent api to create a payment intent
* 
* @param onClose - callback function to close the modal
*/
const AddFundForm: React.FC<AddFundFormProps> = ({ onClose }) => {
  const formCtx = useForm({
    mode: "onSubmit",
    defaultValues: {
      amount: 0,
    },
  });
  const isDark = useThemeHook();
  const { success, error: toastError } = useToast();

  const stripe = useStripe();
  const elements = useElements();

  const amountFromForm = formCtx.watch("amount");
  const amount = Number(amountFromForm) || 0;

  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { mutateAsync, isPending: isCreatingIntent } = useCreatePaymentIntent();
  const { data: balanceArr, isLoading: isBalanceLoading } = useClientBalance();
  const balance = Array.isArray(balanceArr) ? balanceArr[0] : balanceArr;
  const currencyCode = balance?.currencyCode?.toLowerCase() || "gbp";
  const isLoading = isCreatingIntent || isProcessingPayment || isBalanceLoading;

  const handleSubmit = async (data: { amount: number | string }) => {
    const finalAmount = Number(data.amount);
    setFormError(null);
    if (!stripe || !elements) {
      setFormError("Payment system not ready");
      return;
    }
    if (finalAmount <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }
    if (!currencyCode) {
      setFormError("Currency is not available. Please refresh and try again.");
      return;
    }

    try {
      setIsProcessingPayment(true);
      const { clientSecret } = await mutateAsync({
        body: { amount: finalAmount, currency: currencyCode },
      });

      if (!clientSecret) {
        throw new Error("Missing client secret from payment intent");
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error("Card details are not available");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      const status = result.paymentIntent?.status;
      if (status === "succeeded") {
        success("Payment successful");
        onClose();
      } else if (status === "processing") {
        success("Payment is processing. Your balance will be updated shortly.");
        onClose();
      } else if (status === "requires_capture") {
        success(
          "Payment has been authorized and is awaiting capture. Your balance will be updated once the payment is finalized."
        );
        onClose();
      } else {
        throw new Error(
          `Payment could not be completed. Status: ${status ?? "unknown"}`
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setFormError(message);
      toastError(message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <FormContainer methods={formCtx} onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Add Funds</h2>
      <InputField
        name="amount"
        label="Amount"
        type="number"
        required
        rules={{
          required: "Amount is required",
          min: { value: 0, message: "Amount must be greater than 0" },
        }}
      />
      <div>
        <label className="block text-sm font-medium">Card number</label>
        <div className="mt-1 p-2 border rounded-md bg-white dark:bg-gray-800">
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: isDark ? "#fff" : "#000",
                  "::placeholder": { color: isDark ? "#aaa" : "#666" },
                },
                invalid: { color: "#dc2626" },
              },
            }}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Expiry</label>
            <div className="mt-1 p-2 border rounded-md bg-white dark:bg-gray-800">
              <CardExpiryElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: isDark ? "#fff" : "#000" },
                    invalid: { color: "#dc2626" },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">CVC</label>
            <div className="mt-1 p-2 border rounded-md bg-white dark:bg-gray-800">
              <CardCvcElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: isDark ? "#fff" : "#000" },
                    invalid: { color: "#dc2626" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {formError && <div className="text-red-600 text-sm">{formError}</div>}

      {/* use shared Button for theme styling */}
      <Button
        type="submit"
        loading={isLoading}
        disabled={amount <= 0 || !stripe || !elements || !currencyCode || isLoading}
        className="w-full"
      >
        {amount > 0 ? "Pay Now" : "Enter amount"}
      </Button>
    </FormContainer>
  );
};

export default AddFundForm;

