import React from "react";
import { InputField } from "./commonUI/inputs";
import {
  cardNumberValidation,
  countryValidation,
  cvvValidation,
  expiryDateValidation,
  validateAddress,
} from "@/utils/validate";
import SelectField from "./commonUI/inputs/SelectField";
import { Button } from "./commonUI/Buttons";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import countries from "@/dummy_data/countriesCard";
import { AiOutlineClose } from "react-icons/ai";
import { FormContainer } from "./commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

/**
 * Interface for the card form data.
 * @property {string} cardNumber - The credit or debit card number.
 * @property {string} expDate - The expiration date in MM/YY format.
 * @property {string} cvv - The 3 or 4-digit card verification value.
 * @property {string} country - The country associated with the card's billing address.
 * @property {string} address - The billing address for the card.
 */
export interface CardFormData {
  cardNumber: string;
  expDate: string;
  cvv: string;
  country: string;
  address: string;
}
/**
 * Props for the AddCard component.
 * @property {() => void} onClose - Callback function to close the card form/modal.
 * @property {(cardData: CardFormData) => void} onAddCard - Callback function invoked with the new card data upon successful submission.
 */
interface AddCardProps {
  onClose: () => void;
  onAddCard: (cardData: CardFormData) => void;
}

/**
 * A form component for adding a new credit or debit card.
 * It includes fields for card number, expiry date, CVV, country, and address,
 * with built-in validation using `react-hook-form`.
 *
 * @component
 * @param {AddCardProps} props - The props for the component.
 */
const AddCard: React.FC<AddCardProps> = ({ onClose, onAddCard }) => {
  const methods = useForm<CardFormData>({
    defaultValues: {
      cardNumber: "",
      expDate: "",
      cvv: "",
      country: "",
      address: "",
    },
    mode: "onSubmit",
  });

  const handleAddCard = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      const data = methods.getValues();
      console.log("Valid card data:", data);
      toast.success("Card added successfully.");
      onClose();
      onAddCard(data);
    }
  };

  return (
    <FormContainer
      methods={methods}
      onSubmit={handleAddCard}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col h-full max-h-[90vh] w-full max-w-md">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4">
          <div className="flex justify-end">
            <button
              className="cursor-pointer text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              onClick={onClose}
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-xl font-bold text-center"> Add Card</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div>
            <InputField
              label="Card Number"
              name="cardNumber"
              placeholder="9999 9999 9999 9999"
              rules={{ validate: (v: string) => cardNumberValidation(v) }}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField
                label="Expiry Date"
                name="expDate"
                placeholder="MM/YY"
                rules={{ validate: (v: string) => expiryDateValidation(v) }}
                required
              />
            </div>
            <div>
              <InputField
                label="CVV"
                name="cvv"
                placeholder="Enter CVV"
                rules={{ validate: (v: string) => cvvValidation(v) }}
                required
                allowedCharacters="numbers"
              />
            </div>
          </div>

          <div>
            <SelectField
              label="Country"
              name="country"
              placeholder="Country"
              options={countries.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
              required
              rules={{ validate: (v: string) => countryValidation(v) }}
            />
          </div>

          <div>
            <InputField
              label="Address"
              name="address"
              placeholder="Enter Address"
              required
              rules={{ validate: (v: string) => validateAddress(v) }}
            />
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-gray-800  ">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              <div className="flex gap-1 items-center">
                <HiOutlinePlusSmall className="text-lg" /> Add New Card
              </div>
            </Button>
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default AddCard;
