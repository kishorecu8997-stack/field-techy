export interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

export const countries: CountryOption[] = [
  { value: "IN", label: "India", flag: "🇮🇳" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "UAE", label: "Dubai", flag: "🇦🇪" },
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
  { value: "AU", label: "Australia", flag: "🇦🇺" },
  { value: "DE", label: "Germany", flag: "🇩🇪" },
  { value: "FR", label: "France", flag: "🇫🇷" },
  { value: "JP", label: "Japan", flag: "🇯🇵" },
];

export default countries;
