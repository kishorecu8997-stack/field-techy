import React from "react";
import { useForm } from "react-hook-form";
import { FormContainer } from "./commonUI/inputs/FormContainer";
import { InputField } from "./commonUI/inputs";
import { cardNumberValidation, cvvValidation, expiryDateValidation, validateAddress } from "@/utils/validate";
import SelectField from "./commonUI/inputs/SelectField";
import { Button } from "./commonUI/Buttons";
import { HiOutlinePlusSmall } from "react-icons/hi2";

export interface CardFormData {
  cardNumber: string;
  expDate: string;
  cvv: string;
  country: string;
  address: string;
}

interface AddCardProps {
  onClose: () => void;
  onAddCard: (cardData: CardFormData) => void;
}

const AddCard: React.FC<AddCardProps> = ({ onClose, onAddCard }) => {
  const methods = useForm<CardFormData>({
    defaultValues: {
      cardNumber: "",
      expDate: "",
      cvv: "",
      country: "UAE",
      address: "",
    },
    mode: "onSubmit",
  });

  const countries = [
    { code: "UAE", name: "Dubai", flag: "🇦🇪" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
  ];

  const handleSubmit = (data: CardFormData) => {
    console.log("Form submitted with data:", data);
    onAddCard(data);
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Add Card
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
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
            />
            </div>
          </div>

          <div>           
               <SelectField
                     label="Country"
                     name="country"
                     placeholder="Country"
                     options={countries.map((c) => ({
                       value: c.code,
                       label: c.name,
                     }))}
                     required                     
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

          <Button
            variant="outline"            
            className="flex mt-4 w-full py-3 border-2 border-dashed hover:text-white border-teal-700 text-teal-700 font-medium rounded-md hover:bg-teal-700 transition"
          >
            <div className="flex gap-1 items-center">
              <HiOutlinePlusSmall className="text-lg" /> Add New Card
            </div>
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default AddCard;
