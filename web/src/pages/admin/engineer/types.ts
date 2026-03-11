export interface BasicInformation {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: File | FileList | string | null;
  address: string;
  skills: string[] | string;
  price: string | number | null;
  serviceCategory: string;
  portfolio: string;
  Country: string;
  State: string;
  City: string;
}

export interface ExperienceDetails {
  designation: string;
  location: string;
  employer: string;
  experience: string;
  resume: File | FileList | string | null;
}

// ---------- Documents ----------
export interface Documents {
  governmentId: File | FileList | string | null;
  certificate: File | FileList | string | null;
}
export interface DocumentOption {
  value: string;
  label: string;
}

export const documentType: DocumentOption[] = [
  { value: "resumeFile", label: "Resume File" },
  { value: "govIdDoc", label: "Government Document" },
  { value: "certificateDoc", label: "Certificate Document" },
];

export type EngineerFormData = BasicInformation & ExperienceDetails & Documents;

// data/engineerDummyData.ts
export const ENGINEER_PROFILE_DATA = {
  name: "Buyer Adam",
  address:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, aliquam.",
  walletBalance: "$300",
  phoneNumber: "+98 23456789",
  registrationDate: "15 March, 2025",
  totalEarning: "$3000",
  emailAddress: "kishore@yopmail.com",
  kycStatus: "Verified",
  lastLoginDate: "12-06-2024",
  averageRating: 4.3,
};

// data/bankCardData.ts
export const BANK_CARD_DATA = {
  bankName: "ENDB Bank",
  cardNumber: "9876541320",
  bankAddress:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut, modi animikishore et distinctio ipsam corrupti.",
  ibanNumber: "456789",
  cardHolderName: "Kishore",
  swiftCode: "AHGFH456",
  walletBalance: "AED 500",
};
export interface DetailsTypes {
  name: string;
  phone: string;
  email: string;
}

export interface StatusHistoryType {
  type: "suspension" | "block";
  reason: string;
  startDate?: string;
  endDate?: string;
  actionDate: string;
  adminName: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
}
export interface ManageEngineerProps {
  // API fields
  id: number;
  userId: number;
  engineerCode: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string | null; // fallback string like "City, Country"
  cityId?: number;
  stateId?: number;
  countryId?: number;
  postalCode?: string;
  serviceCategoryId?: number;
  employmentTypeId?: number | null;
  hourlyRate?: number;
  portfolioLink?: string;
  employer?: string;
  currentDesignation?: string | null;
  experienceYears?: number;
  locationEnabled?: boolean;
  notificationEnabled?: boolean;
  averageRating: number;
  profileStatus: string;
  isEmployed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  registrationDate: string;
  userStatus: string;

  // Location names
  cityName?: string;
  stateName?: string;
  countryName?: string;

  // Optional nested objects
  city?: { id: number; name: string };
  state?: { id: number; name: string };
  country?: { id: number; name: string };
  profilePicture?: FileType;
  resumeFile?: FileType;
  govIdDoc?: FileType;
  certificateDoc?: FileType;

  user?: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    status: string;
    userRole: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    updatedAt: string;
    createdAt: string;
  };

  // Derived / UI fields
  engineerID?: string;
  details?: DetailsTypes;
  walletBalance?: string;
  balance?: number;
  kycStatus?: string;
  employmentStatus?: string;
  avgRating?: number;
  approvalStatus?: string;
  lastActiveOn?: string;

  // Suspension info
  suspendFrom?: string;
  suspendTo?: string;
  suspendReason?: string;
  suspendBy?: string;
  suspendOn?: string;
  currentStatus?: string;

  submittedDocuments?: string[];
  documents?: string;
  statusHistory?: StatusHistoryType[];
}

export interface FileType {
  id: number | null;
  url: string;
  filename: string;
  size: string;
}

export interface SuspendEngineerFormData {
  suspendStartDate: Date | null;
  suspendEndDate: Date | null;
  reason: string;
}

export interface BlockEngineerFormData {
  reason: string;
}

export const SUSPEND_ENGINEER_DEFAULT_VALUES: SuspendEngineerFormData = {
  suspendStartDate: null,
  suspendEndDate: null,
  reason: "",
};
export interface ActionMenuProps {
  row: ManageEngineerProps;
  showAction: number | null;
  setShowAction: (v: number | null) => void;
  handleDelete: (row: ManageEngineerProps) => void;
  setIsSuspend: (v: boolean) => void;
  setIsBlock: (v: boolean) => void;
}
export type DropdownDirection = "up" | "down";

export const EngineerStatus = {
  APPROVE: "approved",
  REJECT: "rejected",
  PENDING: "pending",
} as const;

export type EngineerStatusType =
  (typeof EngineerStatus)[keyof typeof EngineerStatus];

export type EngineerApiResponse = {
  id: number;
  userId: number;
  engineerCode: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  cityName: string;
  countryName: string;
  registrationDate: string;
  balance: number;
  profileStatus: string;
  isEmployed: boolean;
  averageRating: number;
  user?: {
    name: string;
    email: string;
    phone_number: string;
  };
  isLoading?: boolean;
};
