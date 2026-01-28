export interface BusinessType {
  id: string;
  name: string;
  description: string;
}

export const BUSINESS_TYPES: BusinessType[] = [];

export interface Industry {
  id: string;
  name: string;
  description: string;
}

export const INDUSTRIES: Industry[] = [
  {
    id: "technology",
    name: "Technology",
    description:
      "Software development, IT services, hardware, and digital innovation.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Hospitals, clinics, pharmaceuticals, and medical services.",
  },
  {
    id: "finance",
    name: "Finance",
    description:
      "Banking, insurance, investment, and financial advisory services.",
  },
  {
    id: "education",
    name: "Education",
    description:
      "Schools, universities, e-learning platforms, and training providers.",
  },
  {
    id: "retail",
    name: "Retail",
    description:
      "Stores and e-commerce businesses selling directly to consumers.",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Production of goods from raw materials or components.",
  },
  {
    id: "construction",
    name: "Construction",
    description:
      "Building infrastructure, residential, and commercial properties.",
  },
  {
    id: "transportation",
    name: "Transportation & Logistics",
    description: "Freight, shipping, delivery, and supply chain management.",
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    description: "Electricity, oil, gas, renewables, and water services.",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Farming, livestock, fisheries, and agribusiness.",
  },
  {
    id: "hospitality",
    name: "Hospitality & Tourism",
    description: "Hotels, restaurants, travel agencies, and event services.",
  },
  {
    id: "media",
    name: "Media & Entertainment",
    description: "TV, film, music, publishing, gaming, and streaming services.",
  },
  {
    id: "real_estate",
    name: "Real Estate",
    description: "Property development, sales, leasing, and management.",
  },
  {
    id: "telecommunications",
    name: "Telecommunications",
    description: "Mobile, internet, and communication network providers.",
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Vehicle manufacturing, sales, repair, and parts supply.",
  },
  {
    id: "professional_services",
    name: "Professional Services",
    description: "Legal, accounting, consulting, and marketing firms.",
  },
  {
    id: "nonprofit",
    name: "Nonprofit & NGOs",
    description:
      "Charitable organizations, foundations, and social enterprises.",
  },
  {
    id: "government",
    name: "Government & Public Sector",
    description: "Public administration, defense, and civic services.",
  },
  {
    id: "service",
    name: "General Services",
    description:
      "Businesses offering personal or professional services not covered elsewhere.",
  },
  {
    id: "maintenance",
    name: "Maintenance & Repair",
    description: "Facility, equipment, or infrastructure upkeep and servicing.",
  },
];

export interface CountryOption {
  value: string;
  label: string;
  states: StateOption[];
}
export interface StateOption {
  value: string;
  label: string;
  cities: CityOption[];
}
export interface CityOption {
  value: string;
  label: string;
}

export const countries: CountryOption[] = [
  {
    value: "in",
    label: "India",
    states: [
      {
        value: "tn",
        label: "Tamil Nadu",
        cities: [
          { value: "che", label: "Chennai" },
          { value: "cbe", label: "Coimbatore" },
        ],
      },
      {
        value: "mh",
        label: "Maharashtra",
        cities: [
          { value: "mum", label: "Mumbai" },
          { value: "pun", label: "Pune" },
        ],
      },
    ],
  },
  {
    value: "uk",
    label: "United Kingdom",
    states: [
      {
        value: "eng",
        label: "England",
        cities: [
          { value: "ldn", label: "London" },
          { value: "man", label: "Manchester" },
        ],
      },
      {
        value: "sct",
        label: "Scotland",
        cities: [
          { value: "edi", label: "Edinburgh" },
          { value: "gla", label: "Glasgow" },
        ],
      },
    ],
  },
];

export interface businessTypeOption {
  value: string;
  label: string;
}

export const businessTypes: businessTypeOption[] = [
  { value: "1", label: "LLC" },
  { value: "2", label: "Corporation" },
  { value: "3", label: "Sole Proprietorship" },
  { value: "4", label: "Partnership" },
];

interface PersonalInfo {
  companyName: string;
  contactPersonName: string;
  phoneNumber: string;
  businessType: string;
  industry: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  taxDocument: string;
  vatRegistrationNumber: string;
}

interface LoginInfo extends PersonalInfo {}

const loginData: LoginInfo[] = [
  {
    companyName: "FieldTechy",
    contactPersonName: "Nick Wilson",
    phoneNumber: "+91 9988552200",
    businessType: "Retail",
    industry: "Technology",
    address: "7 Tech Boulevard, TNagar, Chennai 600017",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    postalCode: "600017",
    taxDocument: "",
    vatRegistrationNumber: "VAT123456789",
  },
];

// Export types and data
export type { PersonalInfo };
export { loginData };

export default countries;
