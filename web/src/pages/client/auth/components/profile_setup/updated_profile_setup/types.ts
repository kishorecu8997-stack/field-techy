export interface ClientBasicDetails {
  // Common fields for both home and corporate clients
  fullName?: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  address: string;

  // Corporate-specific fields
  companyName?: string;
  contactPersonName?: string;
  businessType?: string;
  industry?: string;
  vat?: string;
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
