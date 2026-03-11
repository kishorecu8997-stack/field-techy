export interface CurrencyConversionRow {
  id: number | null;
  countryName: string;
  currencyId: number;
  currencyCode: string;
  currencySymbol: string | null;
  currencyPair: string;
  rate: string | null;
  lastUpdated: string | null;
  lastUpdatedBy: string | null;
}
