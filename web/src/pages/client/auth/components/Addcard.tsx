import countries from "@/dummy_data/countries";
import { validateAddress } from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import {
  cardNumberValidation,
  cvvValidation,
  expiryDateValidation,
} from "@/shared/libs/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

import { AiOutlineClose } from "react-icons/ai";

export interface CardFormData {
  cardNumber: string;
  expDate: string;
  cvv: string;
  PaymentCountry: string;
  cardAddress: string;
}

interface AddCardProps {
  onClose: () => void;
  onAddCard: (cardData: CardFormData) => void;
}

const AddCard: React.FC<AddCardProps> = ({ onClose, onAddCard }) => {
  const methods = useFormContext();

  const handleAddCard = async () => {
    const isValid = await methods.trigger(["cardAddress", "cvv", "expDate", "cardNumber", "PaymentCountry"]);
    if (isValid) {
      const data = methods.getValues();
      console.log("Valid card data:", data);
      onAddCard(data as CardFormData);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Add Card
        </h2>
        <AiOutlineClose onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="space-y-6">
        <InputField
          label="Card Number"
          name="cardNumber"
          placeholder="9999 9999 9999 9999"
          rules={{ validate: (v: string) => cardNumberValidation(v) }}
          required
          allowedCharacters="numbers"
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Expiry Date"
            name="expDate"
            placeholder="MM/YY"
            rules={{ validate: (v: string) => expiryDateValidation(v) }}
            required
            allowedCharacters="digits-slash"
          />

          <InputField
            label="CVV"
            name="cvv"
            placeholder="Enter CVV"
            rules={{ validate: (v: string) => cvvValidation(v) }}
            required
            allowedCharacters="numbers"
          />
        </div>

        <SelectField
          label="Country"
          name="PaymentCountry"
          placeholder="Country"
          options={countries.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
          required
        />

        <InputField
          label="Address"
          name="cardAddress"
          placeholder="Enter Address"
          required
          rules={{ validate: (v: string) => validateAddress(v) }}
        />

        <Button
          type="button"
          onClick={handleAddCard}
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Add Card
        </Button>
      </div>
    </div>
  );
};

export default AddCard;
