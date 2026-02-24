export interface CurrencyConversionRow {
  id: string;
  country: string;
  currencyPair: string;
  baseCurrency: "INR";
  exchangeRate: number;
  lastUpdated: string;
  lastUpdatedBy: string;
}
