export interface EngineerBasicDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  country: any; // Select option or string
  state: any;
  city: any;
  postalCode: string;

  // Professional
  skills: (string | number)[]; // TagSelect options - IDs can be string or number
  portfolioLink: string;
  serviceCategory: string | number; // Select option - ID can be string or number
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
