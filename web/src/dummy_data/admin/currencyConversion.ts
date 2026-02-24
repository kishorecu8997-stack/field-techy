import type { CurrencyConversionRow } from "@/pages/admin/manage_currency_conversion/types";

export const CurrencyConversionData: CurrencyConversionRow[] = [
  {
    id: "1",
    country: "Afghanistan",
    currencyPair: "AFN → INR",
    baseCurrency: "INR",
    exchangeRate: 1.02,
    lastUpdated: "2026-02-19",
    lastUpdatedBy: "Admin",
  },
  {
    id: "2",
    country: "United Arab Emirates",
    currencyPair: "AED → INR",
    baseCurrency: "INR",
    exchangeRate: 22.61,
    lastUpdated: "2026-02-18",
    lastUpdatedBy: "Admin",
  },
  {
    id: "3",
    country: "United States",
    currencyPair: "USD → INR",
    baseCurrency: "INR",
    exchangeRate: 83.12,
    lastUpdated: "2026-02-18",
    lastUpdatedBy: "Admin",
  },
];
