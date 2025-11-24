import React from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { initialPaymentOptions } from "@/dummy_data/cardDetails";
import { Button } from "./Buttons";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import type { PaymentMethodSelectorProps } from "../type";

/**
 * A component for selecting a payment method from a list of cards.
 * Integrates with `react-hook-form` and allows adding new payment methods.
 * @param {PaymentMethodSelectorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered payment method selector.
 */
const PaymentMethod: React.FC<PaymentMethodSelectorProps> = ({
  name,
  label,
  isShowLabel = true,
  isShowRadio = false,
  required = false,
  rules,
  options = initialPaymentOptions,
  setIsOpen,
}) => {
  const { control } = useFormContext();

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  /**
   * Returns a short logo string based on the card brand.
   * @param {string} brand - The brand of the credit card (e.g., "visa", "mastercard").
   * @returns {string} A short representation of the card brand logo.
   */
  const getCardLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes("visa")) return "VISA";
    if (brandLower.includes("master")) return "MC";
    if (brandLower.includes("amex")) return "AMEX";
    if (brandLower.includes("discover")) return "DISC";
    return brand.toUpperCase().substring(0, 2);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="flex flex-col">
          {isShowLabel && (
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            {options.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {options.map((card) => (
                  <div
                    key={card.id}
                    onClick={() =>
                      onChange({
                        value: card.id,
                        label: `xxxx xxxx xxxx ${card.last4}`,
                      })
                    }
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors
                      ${
                        value?.value === card.id
                          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500"
                          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-white dark:bg-gray-700 px-1">
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
                        className="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500 dark:border-gray-600"
                        aria-label={`Select ${card.brand} ending in ${card.last4}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No payment methods added yet.
                </p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="mt-2 w-full py-3 text-teal-600 border-2 border-dashed border-teal-600 font-medium rounded-md hover:bg-teal-600 hover:text-white transition dark:text-teal-400 dark:border-teal-400"
            >
              <div className="flex items-center justify-center gap-1">
                <HiOutlinePlusSmall className="text-lg" /> Add New Card
              </div>
            </Button>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default PaymentMethod;