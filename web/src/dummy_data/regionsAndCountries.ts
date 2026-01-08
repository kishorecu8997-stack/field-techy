export interface RegionCountryOption {
  value: string;
  label: string;
  type: "option" | "region" | "subdivision";
  region?: string;
}

export const regionsAndCountries: RegionCountryOption[] = [
  { value: "Country", label: "Country", type: "option" },

  { value: "India", label: "India", type: "region" },
  { value: "UK", label: "UK", type: "region" },

  {
    value: "andhra-pradesh",
    label: "Andhra Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "arunachal-pradesh",
    label: "Arunachal Pradesh",
    type: "subdivision",
    region: "India",
  },
  { value: "assam", label: "Assam", type: "subdivision", region: "India" },
  { value: "bihar", label: "Bihar", type: "subdivision", region: "India" },
  {
    value: "chhattisgarh",
    label: "Chhattisgarh",
    type: "subdivision",
    region: "India",
  },
  { value: "goa", label: "Goa", type: "subdivision", region: "India" },
  { value: "gujarat", label: "Gujarat", type: "subdivision", region: "India" },
  { value: "haryana", label: "Haryana", type: "subdivision", region: "India" },
  {
    value: "himachal-pradesh",
    label: "Himachal Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "jharkhand",
    label: "Jharkhand",
    type: "subdivision",
    region: "India",
  },
  {
    value: "karnataka",
    label: "Karnataka",
    type: "subdivision",
    region: "India",
  },
  { value: "kerala", label: "Kerala", type: "subdivision", region: "India" },
  {
    value: "madhya-pradesh",
    label: "Madhya Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "maharashtra",
    label: "Maharashtra",
    type: "subdivision",
    region: "India",
  },
  { value: "manipur", label: "Manipur", type: "subdivision", region: "India" },
  {
    value: "meghalaya",
    label: "Meghalaya",
    type: "subdivision",
    region: "India",
  },
  { value: "mizoram", label: "Mizoram", type: "subdivision", region: "India" },
  {
    value: "nagaland",
    label: "Nagaland",
    type: "subdivision",
    region: "India",
  },
  { value: "odisha", label: "Odisha", type: "subdivision", region: "India" },
  { value: "punjab", label: "Punjab", type: "subdivision", region: "India" },
  {
    value: "rajasthan",
    label: "Rajasthan",
    type: "subdivision",
    region: "India",
  },
  { value: "sikkim", label: "Sikkim", type: "subdivision", region: "India" },
  {
    value: "tamil-nadu",
    label: "Tamil Nadu",
    type: "subdivision",
    region: "India",
  },
  {
    value: "telangana",
    label: "Telangana",
    type: "subdivision",
    region: "India",
  },
  { value: "tripura", label: "Tripura", type: "subdivision", region: "India" },
  {
    value: "uttar-pradesh",
    label: "Uttar Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "uttarakhand",
    label: "Uttarakhand",
    type: "subdivision",
    region: "India",
  },
  {
    value: "west-bengal",
    label: "West Bengal",
    type: "subdivision",
    region: "India",
  },
  { value: "delhi", label: "Delhi", type: "subdivision", region: "India" },
  {
    value: "jammu-and-kashmir",
    label: "Jammu and Kashmir",
    type: "subdivision",
    region: "India",
  },

  { value: "eng", label: "England", type: "subdivision", region: "UK" },
  { value: "sct", label: "Scotland", type: "subdivision", region: "UK" },
  { value: "wls", label: "Wales", type: "subdivision", region: "UK" },
  {
    value: "nir",
    label: "Northern Ireland",
    type: "subdivision",
    region: "UK",
  },

  { value: "lnd", label: "London", type: "subdivision", region: "UK" },
  { value: "man", label: "Manchester", type: "subdivision", region: "UK" },
  { value: "bml", label: "Birmingham", type: "subdivision", region: "UK" },
  { value: "edb", label: "Edinburgh", type: "subdivision", region: "UK" },
  { value: "gla", label: "Glasgow", type: "subdivision", region: "UK" },
  { value: "car", label: "Cardiff", type: "subdivision", region: "UK" },
  { value: "bfs", label: "Belfast", type: "subdivision", region: "UK" },
];

export default regionsAndCountries;
