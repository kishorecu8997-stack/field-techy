export interface EngineerBasicDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  country: string | number | { value?: string | number; label?: string } | null | undefined;
  state: string | number | { value?: string | number; label?: string } | null | undefined;
  city: string | number | { value?: string | number; label?: string } | null | undefined;
  postalCode: string;

  // Professional
  skills: (string | number | { value: string | number; label?: string })[]; // TagSelect options
  portfolioLink: string;
  serviceCategory: string | number | { value: string | number; label?: string } | null | undefined; // Select option
  amount: string; // Rate/Budget
  designation: string;
  company: string;
  experienceYears: string;

  // Meta
  password?: string;
  confirmPassword?: string;
  isEnableNotifications?: boolean;
  termsAndConditions?: boolean;
}

export interface EngineerDocuments {
  resumeUrl: string;
  governmentIdUrl: string;
  certificateUrl: string;
  profileImageUrl: string;
}

export interface EngineerStatusUpdate {
  id: string;
  status: string;
  remarks: string;
  workScreenShot: FileList | null;
}
