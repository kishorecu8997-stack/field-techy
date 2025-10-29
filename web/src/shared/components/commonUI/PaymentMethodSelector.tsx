import React, { useState } from "react";
import Popup from "../Popup";
import AddCard, { type CardFormData } from "../AddCard";

export interface PaymentCardOption {
  id: string;
  last4: string; // e.g., "5678"
  brand: "visa" | "mastercard" | "amex" | "discover" | string;
  name: string; // e.g., "Mobile App UI/UX Designer"
}

interface PaymentMethodSelectorProps {
  options: PaymentCardOption[];
  selectedId: string | null;
  onChange: (id: string) => void;
  onAddNew: (cardData: CardFormData) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  options,
  selectedId,
  onChange,
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
    onAddNew(cardData);
    setIsOpen(false);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="space-y-4">
        {/* Existing Cards */}
        {options.map((card, index) => (
          <div
            key={card.id}
            onClick={() => onChange(card.id)}
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
              {/* Card Brand Logo */}
              <div className="w-10 h-6 flex items-center justify-center bg-white dark:bg-gray-700 rounded px-1">
                <span className="text-xs font-bold text-gray-800 dark:text-white">
                  {getCardLogo(card.brand)}
                </span>
              </div>

              {/* Card Details */}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  xxxx xxxx xxxx {card.last4}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {card.name}
                </p>
              </div>
            </div>

            {/* Radio Button */}
            <input
              type="radio"
              name="payment-method"
              checked={selectedId === card.id}
              onChange={() => onChange(card.id)}
              className="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              aria-label={`Select ${card.brand} ending in ${card.last4}`}
            />
          </div>
        ))}

        {/* Add New Card */}
        <div
          onClick={() => setIsOpen(true)}
          className="border-2 border-dotted rounded-lg p-4 text-center cursor-pointer transition-all duration-200
    border-gray-300 hover:border-emerald-400 dark:border-gray-600 dark:hover:border-emerald-500
    hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <button
            type="button"
            className="text-sm font-medium flex items-center justify-center w-full
      text-emerald-700 dark:text-emerald-400
      hover:text-emerald-800 dark:hover:text-emerald-300
      transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Card
          </button>
        </div>
        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <AddCard onClose={() => setIsOpen(false)} onAddCard={handleAddCard} />
        </Popup>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
