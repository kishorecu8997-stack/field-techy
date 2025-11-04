import { useState } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import PaymentMethod, {
  type PaymentCardOption,
} from "@/shared/components/commonUI/PaymentMethod";
import { initialPaymentOptions } from "@/dummy_data/initialPaymentData";
import { validateAmount, validatePaymentMethods } from "@/utils/validate";
import type { SelectOption } from "@/shared/components/commonUI/inputs/type";

export interface AddFundFormData {
  amount: string;
  cardId: string;
}

const AddFund = () => {
  const handleSubmit = (data: AddFundFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  const methods = useForm<AddFundFormData>({
    defaultValues: {
      amount: "",
      cardId: initialPaymentOptions[0]?.id || "",
    },
    mode: "onSubmit",
  });

  const [paymentOptions, setPaymentOptions] = useState<PaymentCardOption[]>(
    initialPaymentOptions
  );

  const handleAddNewCard = (cardData: { cardNumber: string }) => {
    const newCard: PaymentCardOption = {
      id: `card_${Date.now()}`,
      last4: cardData.cardNumber.slice(-4),
      brand: "visa", // You might want to determine this dynamically
      name: "New Card",
    };
    setPaymentOptions((prev) => [...prev, newCard]);
    methods.setValue("cardId", newCard.id);
  };
  return (
    <FormContainer
      methods={methods}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <InputField
          label="Amount"
          name="amount"
          placeholder="Enter Amount e.g., $10"
          required
          rules={{ validate: (v: string) => validateAmount(v) }}
        />
        <div className="space-y-3">
          <PaymentMethod
            name="cardId"
            label="Select Payment Method"
            required
            options={paymentOptions}
            onAddNew={handleAddNewCard}
            isShowRadio={true}
            rules={{ validate: (v: SelectOption) => validatePaymentMethods(v) }}
          />
        </div>
      </div>

      <div className="bg-white ">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Add Fund
        </Button>
      </div>
    </FormContainer>
  );
};

export default AddFund;
