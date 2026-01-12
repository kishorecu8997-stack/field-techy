export interface ServiceOption {
  value: string;
  label: string;
}

export const serviceCategories: ServiceOption[] = [
  { value: "IT & Software Development", label: "IT & Software Development" },
  { value: "Legal Services", label: "Legal Services" },
  { value: "Marketing & Advertising", label: "Marketing & Advertising" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Financial Services", label: "Financial Services" },
  // Add more as needed
];

export default serviceCategories;
