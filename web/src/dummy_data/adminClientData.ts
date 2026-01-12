/**
 * @file Mock data for client-related form options.
 *
 * This file provides structured data for dropdowns used in forms like
 * client creation or editing, ensuring consistency and ease of use.
 */

export const industries = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
];

export const countries = [
  { value: "in", label: "India" },
  { value: "uk", label: "United Kingdom" },
];

export const citiesByCountry: Record<
  string,
  { value: string; label: string }[]
> = {
  in: [
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi" },
    { value: "bangalore", label: "Bangalore" },
  ],
  uk: [
    { value: "london", label: "London" },
    { value: "manchester", label: "Manchester" },
    { value: "birmingham", label: "Birmingham" },
  ],
};

export const businessTypes = [
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
];

export const taxDocuments = [
  { value: "vat-registration", label: "VAT Registration" },
  { value: "gst-certificate", label: "GST Certificate" },
  { value: "tax-id", label: "Tax ID" },
  { value: "other", label: "Other" },
];

export const statesByCountry: Record<
  string,
  { value: string; label: string }[]
> = {
  in: [
    { value: "maharashtra", label: "Maharashtra" },
    { value: "delhi", label: "Delhi" },
    { value: "karnataka", label: "Karnataka" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
  ],
  uk: [
    { value: "england", label: "England" },
    { value: "scotland", label: "Scotland" },
    { value: "wales", label: "Wales" },
    { value: "northern-ireland", label: "Northern Ireland" },
  ],
};
