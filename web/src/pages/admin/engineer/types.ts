import type { adminJobsStatus } from "../jobs/types";

export interface BasicInformation {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: File | null;
  address: string;
  skills: string[] | string;
  price: string | null;
  serviceCategory: string;
  portfolio: string;
}

export interface ExperienceDetails {
  resume: string;
  designation: string;
  location: string;
  employer: string;
  experience: string;
}

export interface Documents {
  governmentId: string;
  certificate: string;
}

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
export interface ManageEngineerProps {
  id: number;
  engineerID: string;
  details: DetailsTypes;
  documents: string;
  status?: adminJobsStatus;
  location: string;
  registrationDate: string;
  walletBalance: string;
  kycStatus: string;
  employmentStatus: string;
  avgRating: number;
  approvalStatus: string;
  lastActiveOn?: string;
  suspendFrom?: string;
  suspendTo?: string;
  suspendReason?: string;
  suspendBy?: string;
  suspendOn?: string;
  currentStatus?: string;
  submittedDocuments: string[];
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
