import React from "react";
import { useForm } from "react-hook-form";
import { InputField } from "@/shared/components/commonUI/inputs";
import {
  cardNumberValidation,
  cvvValidation,
  expiryDateValidation,
  // validateAddress,
} from "@/shared/libs/utils";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { AiOutlineClose } from "react-icons/ai";

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

const AddCard: React.FC<AddCardProps> = ({ onClose }) => {
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
    // TODO: Replace with actual submission logic (e.g., API call)
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Add Card
          </h2>
          <AiOutlineClose onClick={onClose} className="cursor-pointer" />
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
              isShowLabel={false}
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
              // rules={{ validate: (v: string) => validateAddress(v) }}
            />
          </div>

          <Button
            type="button"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Add Card
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default AddCard;
