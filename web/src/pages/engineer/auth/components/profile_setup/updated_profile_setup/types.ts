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
  skills: any[]; // TagSelect options
  portfolioLink: string;
  serviceCategory: any; // Select option
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
  status: string;
  remarks: string;
  workScreenShot: FileList | null;
}
