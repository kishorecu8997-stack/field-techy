import React, { useState } from "react";
import Popup from "@/shared/components/Popup";
import AddCard, { type CardFormData } from "../AddCard";
import { initialPaymentOptions } from "@/dummy_data/cardDetails";
import { IoAdd } from "react-icons/io5";
import { Button } from "./Buttons";
import { HiOutlinePlusSmall } from "react-icons/hi2";

export interface PaymentCardOption {
  id: string;
  last4: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | string;
  name: string;
}

interface PaymentMethodSelectorProps {
  options?: PaymentCardOption[];
  selectedId?: string | null;
  onChange?: (id: string) => void;
  onAddNew?: (cardData: CardFormData) => void;
}

const PaymentMethod: React.FC<PaymentMethodSelectorProps> = ({
  options = initialPaymentOptions,
  selectedId,
  onChange,
  onAddNew,
}) => {
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
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="space-y-4">
          {options.length > 0 ? (
            options.map((card, index) => (
              <div
                key={card.id}
                onClick={() => onChange?.(card.id)}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedId === card.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${
                  index !== 0
                    ? "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
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

                <input
                  type="radio"
                  name="payment-method"
                  checked={selectedId === card.id}
                  className="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  aria-label={`Select ${card.brand} ending in ${card.last4}`}
                />
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
            className="flex mt-4 w-full py-3 border-2 border-dashed hover:text-white border-teal-700 text-teal-700 font-medium rounded-md hover:bg-teal-700 transition"
          >
            <div className="flex gap-1 items-center">
              <HiOutlinePlusSmall className="text-lg" /> Add New Card
            </div>
          </Button>

          <Popup open={isOpen} onClose={() => setIsOpen(false)}>
            <AddCard
              onClose={() => setIsOpen(false)}
              onAddCard={handleAddCard}
            />
          </Popup>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
