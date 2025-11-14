export type CompleteRegistrationData = {
  // Profile Setup
  profileImage?: File;
  companyName: string;
  contactPersonName: string;
  phoneNumber: string;
  businessType: string;
  industry: string;
  address: string;
  state: string;
  city: string;
  vatRegistrationNumber: string;
  // Background Verification
  governmentId?: File;
  certificate?: File;
  vat: string;
  // Set Password
  password: string;
  confirmPassword: string;

  mobileOTP?: string;
  emailOTP?: string;
};
