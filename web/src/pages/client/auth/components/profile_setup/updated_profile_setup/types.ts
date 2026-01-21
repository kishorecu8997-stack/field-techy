export const ClientTypeEnum = {
  HOME: "home",
  CORPORATE: "corporate",
} as const;

export type ClientTypeEnum = (typeof ClientTypeEnum)[keyof typeof ClientTypeEnum];

export interface ClientBasicDetails {
  // Common fields for both home and corporate clients
  fullName?: string;
  email: string;
  phone: string;
  country: string | { value: string; label: string };
  state: string | { value: string; label: string };
  city: string | { value: string; label: string };
  postalCode: string;
  address: string;
  clientType: ClientTypeEnum;

  // Corporate-specific fields
  companyName?: string;
  contactPersonName?: string;
  businessType?: string;
  industry?: string;
  vat?: string | { value: string; label: string };
  vatRegistrationNumber?: string;

  // Verification flags
  isEnableNotifications?: boolean;
  isApproved?: boolean;
  termsAndConditions: boolean;

  // Password fields
  password: string;
  confirmPassword: string;

  // Payment fields
  paymentMethodId?: string;
  cardNumber?: string;
  expDate?: string;
  cvv?: string;
  PaymentCountry?: string;
  cardAddress?: string;
}

export interface ClientDocuments {
  businessLicense?: File;
  taxDocument?: File;
  identityProof?: File;
}

export interface ClientSetPassword {
  mobileOTP?: string;
  emailOTP?: string;
}

export interface ClientCompleteRegistrationData {
  basicDetails: ClientBasicDetails;
  documents: ClientDocuments;
  setPassword: ClientSetPassword;
}
