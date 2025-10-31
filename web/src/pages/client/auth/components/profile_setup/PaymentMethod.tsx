//PaymentMethodSelector.tsx
import React, { useState } from "react";
import AddCard, { type CardFormData } from "../Addcard";
import Popup from "@/shared/components/Popup";
import { cards } from "@/dummy_data/cardDetails";
import { HiOutlinePlusSm } from "react-icons/hi";
import { Button } from "@/shared/components/commonUI/Buttons";

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
  selectedId,
  onAddNew,
}) => {
  // Helper to get card logo
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
    <div>
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
        <h2 className="text-3xl font-bold">Set Payment Method</h2>
        <p className="text-md text-center text-gray-600 mb-6 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 w-[30rem]">
        <div className="space-y-4">
          {cards?.map((card, index) => (
            <div
              key={card.id}
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
              <label className="flex items-center space-x-3 w-full cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded px-1">
                  <span className="text-xs font-bold text-gray-800 dark:text-white">
                    {getCardLogo(card.type)}
                  </span>
                </div>

                {/* Card Details */}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    xxxx xxxx xxxx {card.number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                </div>
              </label>
            </div>
          ))}

          {/* Add New Card */}
          <Button
            variant="outline"
            onClick={() => setIsOpen(true)}
            className="flex mt-4 w-full py-3 border-2 border-dashed hover:text-white border-teal-700 text-teal-700 font-medium rounded-md hover:bg-teal-700 transition"
          >
            <div className="flex gap-1 items-center">
              <HiOutlinePlusSm className="text-lg" /> Add New Card
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
    </div>
  );
};

export default PaymentMethod;
