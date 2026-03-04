import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useToast } from "@/shared/components/commonUI/toastContext.tsx";
import {
  useClientBalance,
  useCreatePaymentIntent,
} from "@/shared/apiServices/client/clientOpenApiService";
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import { useQueryClient } from "@tanstack/react-query";
import { getClientBalanceQueryKey } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";

interface AddFundFormProps {
  onClose: () => void;
}

const AddFundForm: React.FC<AddFundFormProps> = ({ onClose }) => {
  const isDark = useThemeHook();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { mutateAsync, isPending: isCreatingIntent } = useCreatePaymentIntent();
  const { data: balanceArr, isLoading: isBalanceLoading } = useClientBalance();
  const balance = Array.isArray(balanceArr) ? balanceArr[0] : balanceArr;
  const currencyCode = balance?.currencyCode?.toLowerCase();
  const isLoading = isCreatingIntent || isProcessingPayment || isBalanceLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!stripe || !elements) {
      setFormError("Payment system not ready");
      return;
    }
    if (amount <= 0) {
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
        body: { amount, currency: currencyCode },
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
      const paymentSucceeded = result.paymentIntent?.status === "succeeded";
      if (paymentSucceeded) {
        await queryClient.invalidateQueries({
          queryKey: getClientBalanceQueryKey({ client: apiClient }),
        });
        success("Payment successful");
        onClose();
      } else {
        throw new Error("Payment could not be completed");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Add Funds</h2>


      

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={0}
          placeholder="0.00"
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition dark:focus:ring-teal-400/50"
        />
      </div>

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
    </form>
  );
};

export default AddFundForm;

