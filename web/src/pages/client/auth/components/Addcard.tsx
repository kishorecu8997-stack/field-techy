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

/**
 * Represents the Add Card form values.
 *
 * @property {string} cardNumber - Card number as entered by the user.
 * @property {string} expDate - Expiry date in MM/YY format.
 * @property {string} cvv - CVV/CVC code for the card.
 * @property {string} country - Selected country value/label.
 * @property {string} address - Billing address for the card.
 */
export interface CardFormData {
  cardNumber: string;
  expDate: string;
  cvv: string;
  PaymentCountry: string;
  cardAddress: string;
}

/**
 * Props passed to the AddCard component.
 *
 * @property {() => void} onClose - Called when the dialog should be closed.
 * @property {(cardData: CardFormData) => void} onAddCard - Called with validated card data when user submits.
 */
interface AddCardProps {
  onClose: () => void;
  onAddCard: (cardData: CardFormData) => void;
}

/**
 * AddCard component
 *
 * Renders a small form for adding a payment card. When the form is
 * validated successfully, `onAddCard` is invoked with the typed values.
 */
const AddCard: React.FC<AddCardProps> = ({ onClose, onAddCard }) => {
  const methods = useFormContext<CardFormData>();

  // form submission
  /**
   * Validate the form and call `onAddCard` with the collected values when valid.
   * Uses react-hook-form's `trigger` to run validation for all registered fields.
   */
  const handleAddCard = async () => {
    const isValid = await methods.trigger(["cardAddress", "cvv", "expDate", "cardNumber", "PaymentCountry"]);
    if (isValid) {
      const data = methods.getValues();
      console.log("Valid card data:", data);
      onAddCard(data);
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
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Expiry Date"
            name="expDate"
            placeholder="MM/YY"
            rules={{ validate: (v: string) => expiryDateValidation(v) }}
            required
          />
          <InputField
            label="CVV"
            name="cvv"
            placeholder="Enter CVV"
            rules={{ validate: (v: string) => cvvValidation(v) }}
            required
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
