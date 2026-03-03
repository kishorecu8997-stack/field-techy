import type { CurrencyConversionRow } from "@/pages/admin/manage_currency_conversion/types";

export const CurrencyConversionData: CurrencyConversionRow[] = [
  {
    id: 1,
    countryName: "Afghanistan",
    currencyId: 1,
    currencyCode: "AFN",
    currencySymbol: "؋",
    currencyPair: "AFN → INR",
    rate: "1.02",
    lastUpdated: "2026-02-19",
    lastUpdatedBy: "Admin",
  },
  {
    id: 2,
    countryName: "United Arab Emirates",
    currencyId: 2,
    currencyCode: "AED",
    currencySymbol: "د.إ",
    currencyPair: "AED → INR",
    rate: "22.61",
    lastUpdated: "2026-02-18",
    lastUpdatedBy: "Admin",
  },
  {
    id: 3,
    countryName: "United States",
    currencyId: 3,
    currencyCode: "USD",
    currencySymbol: "$",
    currencyPair: "USD → INR",
    rate: "83.12",
    lastUpdated: "2026-02-18",
    lastUpdatedBy: "Admin",
  },
];
