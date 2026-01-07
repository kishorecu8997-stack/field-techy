export interface RegionCountryOption {
  value: string;
  label: string;
  type: "option" | "region" | "country";
  region?: string; // For countries, the region they belong to
}

export const regionsAndCountries: RegionCountryOption[] = [
  { value: "Country", label: "Country", type: "option" },
  // Regions
  { value: "India", label: "India", type: "region" },
  { value: "UK", label: "UK", type: "region" },

  // Indian states as "country" under region: "India"
  {
    value: "andhra-pradesh",
    label: "Andhra Pradesh",
    type: "country",
    region: "India",
  },
  {
    value: "arunachal-pradesh",
    label: "Arunachal Pradesh",
    type: "country",
    region: "India",
  },
  { value: "assam", label: "Assam", type: "country", region: "India" },
  { value: "bihar", label: "Bihar", type: "country", region: "India" },
  {
    value: "chhattisgarh",
    label: "Chhattisgarh",
    type: "country",
    region: "India",
  },
  { value: "goa", label: "Goa", type: "country", region: "India" },
  { value: "gujarat", label: "Gujarat", type: "country", region: "India" },
  { value: "haryana", label: "Haryana", type: "country", region: "India" },
  {
    value: "himachal-pradesh",
    label: "Himachal Pradesh",
    type: "country",
    region: "India",
  },
  { value: "jharkhand", label: "Jharkhand", type: "country", region: "India" },
  { value: "karnataka", label: "Karnataka", type: "country", region: "India" },
  { value: "kerala", label: "Kerala", type: "country", region: "India" },
  {
    value: "madhya-pradesh",
    label: "Madhya Pradesh",
    type: "country",
    region: "India",
  },
  {
    value: "maharashtra",
    label: "Maharashtra",
    type: "country",
    region: "India",
  },
  { value: "manipur", label: "Manipur", type: "country", region: "India" },
  { value: "meghalaya", label: "Meghalaya", type: "country", region: "India" },
  { value: "mizoram", label: "Mizoram", type: "country", region: "India" },
  { value: "nagaland", label: "Nagaland", type: "country", region: "India" },
  { value: "odisha", label: "Odisha", type: "country", region: "India" },
  { value: "punjab", label: "Punjab", type: "country", region: "India" },
  { value: "rajasthan", label: "Rajasthan", type: "country", region: "India" },
  { value: "sikkim", label: "Sikkim", type: "country", region: "India" },
  {
    value: "tamil-nadu",
    label: "Tamil Nadu",
    type: "country",
    region: "India",
  },
  { value: "telangana", label: "Telangana", type: "country", region: "India" },
  { value: "tripura", label: "Tripura", type: "country", region: "India" },
  {
    value: "uttar-pradesh",
    label: "Uttar Pradesh",
    type: "country",
    region: "India",
  },
  {
    value: "uttarakhand",
    label: "Uttarakhand",
    type: "country",
    region: "India",
  },
  {
    value: "west-bengal",
    label: "West Bengal",
    type: "country",
    region: "India",
  },
  { value: "delhi", label: "Delhi", type: "country", region: "India" },
  {
    value: "jammu-and-kashmir",
    label: "Jammu and Kashmir",
    type: "country",
    region: "India",
  },

  // UK States / Regions
  { value: "eng", label: "England", type: "country", region: "UK" },
  { value: "sct", label: "Scotland", type: "country", region: "UK" },
  { value: "wls", label: "Wales", type: "country", region: "UK" },
  { value: "nir", label: "Northern Ireland", type: "country", region: "UK" },

  // Optional subdivisions (counties / major cities)
  { value: "lnd", label: "London", type: "country", region: "UK" },
  { value: "man", label: "Manchester", type: "country", region: "UK" },
  { value: "bml", label: "Birmingham", type: "country", region: "UK" },
  { value: "edb", label: "Edinburgh", type: "country", region: "UK" },
  { value: "gla", label: "Glasgow", type: "country", region: "UK" },
  { value: "car", label: "Cardiff", type: "country", region: "UK" },
  { value: "bfs", label: "Belfast", type: "country", region: "UK" },
];

export default regionsAndCountries;
