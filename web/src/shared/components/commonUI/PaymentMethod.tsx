import React, { useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import Popup from "@/shared/components/Popup";
import AddCard, { type CardFormData } from "../AddCard";
import { initialPaymentOptions } from "@/dummy_data/cardDetails";
import { Button } from "./Buttons";
import { HiOutlinePlusSmall } from "react-icons/hi2";

export interface PaymentCardOption {
  id: string;
  last4: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | string;
  name: string;
}

interface PaymentMethodSelectorProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  isShowRadio?: boolean;
  required?: boolean;
  rules?: RegisterOptions;
  options?: PaymentCardOption[];
  onAddNew?: (cardData: CardFormData) => void;
}

const PaymentMethod: React.FC<PaymentMethodSelectorProps> = ({
  name,
  label,
  isShowLabel = true,
  isShowRadio = false,
  required = false,
  rules,
  options = initialPaymentOptions,
  onAddNew,
}) => {
  const { control } = useFormContext();
  
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const getCardLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes("visa")) return "VISA";
    if (brandLower.includes("master")) return "MC";
    if (brandLower.includes("amex")) return "AMEX";
    if (brandLower.includes("discover")) return "DISC";
    return brand.toUpperCase().substring(0, 2);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleAddCard = (cardData: CardFormData) => {
    onAddNew?.(cardData);
    setIsOpen(false);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
          <div className="flex flex-col">
            {isShowLabel && (
              <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
                {label}{" "}
                {required && <span className="text-red-600">*</span>}
              </label>
            )}
            <div className=" bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="space-y-1">
                {options.length > 0 ? (
                  options.map((card, index) => (
                    <div
                      key={card.id}
                      onClick={() =>
                        onChange({
                          value: card.id,
                          label: `xxxx xxxx xxxx ${card.last4}`,
                        })
                      }
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors 
                        ${
                          value?.value === card.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } 
                        ${
                          index !== 0
                          ? "border-t border-gray-200 dark:border-gray-700"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded px-1">
                          <span className="text-xs font-bold text-gray-800 dark:text-white">
                            {getCardLogo(card.brand)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            xxxx xxxx xxxx {card.last4}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {card.name}
                          </p>
                        </div>
                      </div>

                      {isShowRadio && (
                        <input
                          type="radio"
                          name={name}
                          checked={value?.value === card.id}
                          onChange={() =>
                            onChange({
                              value: card.id,
                              label: `xxxx xxxx xxxx ${card.last4}`,
                            })
                          }
                          className="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                          aria-label={`Select ${card.brand} ending in ${card.last4}`}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No payment methods added yet.
                  </p>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(true)}
                  className="flex mt-2 w-full py-3 border-2 border-dashed hover:text-white border-teal-700 text-teal-700 font-medium rounded-md hover:bg-teal-700 transition"
                >
                  <div className="flex gap-1 items-center">
                    <HiOutlinePlusSmall className="text-lg" /> Add New Card
                  </div>
                </Button>
              </div>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {error.message}
              </p>
            )}
            <Popup open={isOpen} onClose={() => setIsOpen(false)}>
              <AddCard
                onClose={() => setIsOpen(false)}
                onAddCard={handleAddCard}
              />
            </Popup>
          </div>
        )}
      />
    </>
  );
};

export default PaymentMethod;
