import type { CardFormData } from "@/shared/components/AddCard";
import { type RegisterOptions } from "react-hook-form";

export const cardValidationRules: {
  [K in keyof CardFormData]: RegisterOptions<CardFormData, K>;
} = {
  cardNumber: {
    required: "Card number is required.",
    validate: (value: string) => {
      const cleanedValue = value.replace(/\s/g, "");
      if (!cleanedValue) return "Card number is required.";
      if (!/^\d{13,19}$/.test(cleanedValue)) {
        return "Card number must be 13 to 19 digits.";
      }
      return true;
    },
  },
  expDate: {
    required: "Expiry date is required.",
    pattern: {
      value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      message: "Invalid date format. Use MM/YY.",
    },
    validate: (value: string) => {
      const match = value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
      if (!match) return true; // Let pattern handle format errors
      const [, month, year] = match;
      const expiryDate = new Date(Number(`20${year}`), Number(month) - 1); // Month is 0-indexed
      const now = new Date();
      // Set current date to first of the month for fair comparison
      now.setDate(1);
      return expiryDate >= now || "Card has expired.";
    },
  },
  cvv: {
    required: "CVV is required.",
    pattern: {
      value: /^\d{3,4}$/,
      message: "CVV must be 3 or 4 digits.",
    },
  },
  country: {
    required: "Country is required.",
  },
  address: {
    required: "Address is required.",
  },
};
