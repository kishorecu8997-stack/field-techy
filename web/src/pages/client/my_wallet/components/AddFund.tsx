import React, { useState } from "react";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import PaymentMethod, { type PaymentCardOption } from '@/shared/components/commonUI/PaymentMethod';
import { initialPaymentOptions } from "@/dummy_data/initialPaymentData";
import { validateAmount } from "@/utils/validate";

export interface AddFundFormData {
    amount: string;
    cardId: string;    
  }

const AddFund= () => {
  const handleSubmit = (data: AddFundFormData) => {
    console.log("Form submitted with data:", data);
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  const methods = useForm<AddFundFormData>({
    defaultValues: {
      amount: "",
      cardId: "",
    },
    mode: "onSubmit",
  });

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [paymentOptions, setPaymentOptions] = useState<PaymentCardOption[]>(initialPaymentOptions);
    
 const handleAddNewCard = (cardData: { cardNumber: string }) => {
    const newCard: PaymentCardOption = {
      id: `card_${Date.now()}`,
      last4: cardData.cardNumber.slice(-4),
      brand: "visa", // You might want to determine this dynamically
      name: "New Card",
    };
    setPaymentOptions((prev) => [...prev, newCard]);
    setSelectedCard(newCard.id);
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
          placeholder="Amount"
          required
          rules={{ validate: (v: string) => validateAmount(v) }}
        />  
         <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          Select Payment Method <span className="text-red-600">*</span>
        </label>
        <div className="space-y-3">                 
          <PaymentMethod
            options={paymentOptions}
            selectedId={selectedCard}
            onChange={(id) => {
              if (id) {
                setSelectedCard(id);
              }
            }}
            onAddNew={handleAddNewCard}
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
