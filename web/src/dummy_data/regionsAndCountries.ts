export interface RegionCountryOption {
  value: string;
  label: string;
  type: "option" | "region" | "subdivision" | "city";
  region?: string;
}

export const regionsAndCountries: RegionCountryOption[] = [
  { value: "Country", label: "Country", type: "option" },
  { value: "India", label: "India", type: "region" },
  { value: "UK", label: "UK", type: "region" },

  // ================= INDIA =================
  // Andhra Pradesh
  {
    value: "andhra-pradesh",
    label: "Andhra Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "visakhapatnam",
    label: "Visakhapatnam",
    type: "city",
    region: "Andhra Pradesh",
  },
  {
    value: "vijayawada",
    label: "Vijayawada",
    type: "city",
    region: "Andhra Pradesh",
  },

  // Arunachal Pradesh
  {
    value: "arunachal-pradesh",
    label: "Arunachal Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "itanagar",
    label: "Itanagar",
    type: "city",
    region: "Arunachal Pradesh",
  },

  // Assam
  { value: "assam", label: "Assam", type: "subdivision", region: "India" },
  { value: "guwahati", label: "Guwahati", type: "city", region: "Assam" },
  { value: "silchar", label: "Silchar", type: "city", region: "Assam" },

  // Bihar
  { value: "bihar", label: "Bihar", type: "subdivision", region: "India" },
  { value: "patna", label: "Patna", type: "city", region: "Bihar" },
  { value: "gaya", label: "Gaya", type: "city", region: "Bihar" },

  // Chhattisgarh
  {
    value: "chhattisgarh",
    label: "Chhattisgarh",
    type: "subdivision",
    region: "India",
  },
  { value: "raipur", label: "Raipur", type: "city", region: "Chhattisgarh" },
  {
    value: "bilaspur",
    label: "Bilaspur",
    type: "city",
    region: "Chhattisgarh",
  },

  // Goa
  { value: "goa", label: "Goa", type: "subdivision", region: "India" },
  { value: "panaji", label: "Panaji", type: "city", region: "Goa" },
  { value: "margao", label: "Margao", type: "city", region: "Goa" },

  // Gujarat
  { value: "gujarat", label: "Gujarat", type: "subdivision", region: "India" },
  { value: "ahmedabad", label: "Ahmedabad", type: "city", region: "Gujarat" },
  { value: "surat", label: "Surat", type: "city", region: "Gujarat" },

  // Haryana
  { value: "haryana", label: "Haryana", type: "subdivision", region: "India" },
  { value: "gurgaon", label: "Gurgaon", type: "city", region: "Haryana" },
  { value: "faridabad", label: "Faridabad", type: "city", region: "Haryana" },

  // Himachal Pradesh
  {
    value: "himachal-pradesh",
    label: "Himachal Pradesh",
    type: "subdivision",
    region: "India",
  },
  {
    value: "shimla",
    label: "Shimla",
    type: "city",
    region: "Himachal Pradesh",
  },
  {
    value: "manali",
    label: "Manali",
    type: "city",
    region: "Himachal Pradesh",
  },

  // Jharkhand
  {
    value: "jharkhand",
    label: "Jharkhand",
    type: "subdivision",
    region: "India",
  },
  { value: "ranchi", label: "Ranchi", type: "city", region: "Jharkhand" },
  {
    value: "jamshedpur",
    label: "Jamshedpur",
    type: "city",
    region: "Jharkhand",
  },

  // Karnataka
  {
    value: "karnataka",
    label: "Karnataka",
    type: "subdivision",
    region: "India",
  },
  { value: "bangalore", label: "Bangalore", type: "city", region: "Karnataka" },
  { value: "mysore", label: "Mysore", type: "city", region: "Karnataka" },

  // Kerala
  { value: "kerala", label: "Kerala", type: "subdivision", region: "India" },
  {
    value: "thiruvananthapuram",
    label: "Thiruvananthapuram",
    type: "city",
    region: "Kerala",
  },
  { value: "kochi", label: "Kochi", type: "city", region: "Kerala" },

  // Madhya Pradesh
  {
    value: "madhya-pradesh",
    label: "Madhya Pradesh",
    type: "subdivision",
    region: "India",
  },
  { value: "indore", label: "Indore", type: "city", region: "Madhya Pradesh" },
  { value: "bhopal", label: "Bhopal", type: "city", region: "Madhya Pradesh" },

  // Maharashtra
  {
    value: "maharashtra",
    label: "Maharashtra",
    type: "subdivision",
    region: "India",
  },
  { value: "mumbai", label: "Mumbai", type: "city", region: "Maharashtra" },
  { value: "pune", label: "Pune", type: "city", region: "Maharashtra" },

  // Manipur
  { value: "manipur", label: "Manipur", type: "subdivision", region: "India" },
  { value: "imphal", label: "Imphal", type: "city", region: "Manipur" },

  // Meghalaya
  {
    value: "meghalaya",
    label: "Meghalaya",
    type: "subdivision",
    region: "India",
  },
  { value: "shillong", label: "Shillong", type: "city", region: "Meghalaya" },

  // Mizoram
  { value: "mizoram", label: "Mizoram", type: "subdivision", region: "India" },
  { value: "aizawl", label: "Aizawl", type: "city", region: "Mizoram" },

  // Nagaland
  {
    value: "nagaland",
    label: "Nagaland",
    type: "subdivision",
    region: "India",
  },
  { value: "kohima", label: "Kohima", type: "city", region: "Nagaland" },

  // Odisha
  { value: "odisha", label: "Odisha", type: "subdivision", region: "India" },
  {
    value: "bhubaneswar",
    label: "Bhubaneswar",
    type: "city",
    region: "Odisha",
  },
  { value: "cuttack", label: "Cuttack", type: "city", region: "Odisha" },

  // Punjab
  { value: "punjab", label: "Punjab", type: "subdivision", region: "India" },
  { value: "amritsar", label: "Amritsar", type: "city", region: "Punjab" },
  { value: "ludhiana", label: "Ludhiana", type: "city", region: "Punjab" },

  // Rajasthan
  {
    value: "rajasthan",
    label: "Rajasthan",
    type: "subdivision",
    region: "India",
  },
  { value: "jaipur", label: "Jaipur", type: "city", region: "Rajasthan" },
  { value: "udaipur", label: "Udaipur", type: "city", region: "Rajasthan" },

  // Sikkim
  { value: "sikkim", label: "Sikkim", type: "subdivision", region: "India" },
  { value: "gangtok", label: "Gangtok", type: "city", region: "Sikkim" },

  // Tamil Nadu
  {
    value: "tamil-nadu",
    label: "Tamil Nadu",
    type: "subdivision",
    region: "India",
  },
  { value: "chennai", label: "Chennai", type: "city", region: "Tamil Nadu" },
  {
    value: "coimbatore",
    label: "Coimbatore",
    type: "city",
    region: "Tamil Nadu",
  },

  // Telangana
  {
    value: "telangana",
    label: "Telangana",
    type: "subdivision",
    region: "India",
  },
  { value: "hyderabad", label: "Hyderabad", type: "city", region: "Telangana" },

  // Tripura
  { value: "tripura", label: "Tripura", type: "subdivision", region: "India" },
  { value: "agartala", label: "Agartala", type: "city", region: "Tripura" },

  // Uttar Pradesh
  {
    value: "uttar-pradesh",
    label: "Uttar Pradesh",
    type: "subdivision",
    region: "India",
  },
  { value: "lucknow", label: "Lucknow", type: "city", region: "Uttar Pradesh" },
  {
    value: "varanasi",
    label: "Varanasi",
    type: "city",
    region: "Uttar Pradesh",
  },

  // Uttarakhand
  {
    value: "uttarakhand",
    label: "Uttarakhand",
    type: "subdivision",
    region: "India",
  },
  { value: "dehradun", label: "Dehradun", type: "city", region: "Uttarakhand" },
  { value: "haridwar", label: "Haridwar", type: "city", region: "Uttarakhand" },

  // West Bengal
  {
    value: "west-bengal",
    label: "West Bengal",
    type: "subdivision",
    region: "India",
  },
  { value: "kolkata", label: "Kolkata", type: "city", region: "West Bengal" },
  {
    value: "darjeeling",
    label: "Darjeeling",
    type: "city",
    region: "West Bengal",
  },

  // Delhi
  { value: "delhi", label: "Delhi", type: "subdivision", region: "India" },
  { value: "new-delhi", label: "New Delhi", type: "city", region: "Delhi" },

  // Jammu and Kashmir
  {
    value: "jammu-and-kashmir",
    label: "Jammu and Kashmir",
    type: "subdivision",
    region: "India",
  },
  {
    value: "srinagar",
    label: "Srinagar",
    type: "city",
    region: "Jammu and Kashmir",
  },
  { value: "jammu", label: "Jammu", type: "city", region: "Jammu and Kashmir" },

  // ================= UK =================
  // Subdivisions / States
  { value: "eng", label: "England", type: "subdivision", region: "UK" },
  { value: "sct", label: "Scotland", type: "subdivision", region: "UK" },
  { value: "wls", label: "Wales", type: "subdivision", region: "UK" },
  {
    value: "nir",
    label: "Northern Ireland",
    type: "subdivision",
    region: "UK",
  },

  // England Cities
  { value: "london", label: "London", type: "city", region: "England" },
  { value: "manchester", label: "Manchester", type: "city", region: "England" },
  { value: "birmingham", label: "Birmingham", type: "city", region: "England" },

  // Scotland Cities
  { value: "edinburgh", label: "Edinburgh", type: "city", region: "Scotland" },
  { value: "glasgow", label: "Glasgow", type: "city", region: "Scotland" },

  // Wales City
  { value: "cardiff", label: "Cardiff", type: "city", region: "Wales" },

  // Northern Ireland City
  {
    value: "belfast",
    label: "Belfast",
    type: "city",
    region: "Northern Ireland",
  },
];

export default regionsAndCountries;
