export interface ManageClientProps {
  id: number;
  userId: number;
  clientCode: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string | null;
  registrationDate: string;
  balance: number;
  profileStatus: string;
  userStatus: string;
  statusHistory?: Array<{
    type: "suspension" | "block";
    reason: string;
    startDate?: string;
    endDate?: string;
    actionDate: string;
    adminName: string;
    revokedAt?: string | null;
    revokedBy?: string | null;
  }>;
  // Other fields from detail view that might be missing in list view
  clientType?: string;
  companyName?: string;
  personName?: string;
  address?: string;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  postalCode?: string;
  industryId?: number;
  documentType?: string;
  documentNumber?: string;
  profilePictureId?: number | null;
  govIdDocId?: number | null;
  certificateDocId?: number | null;
  user?: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    status: string;
    user_role: string;
    email_verified: boolean;
    phone_verified: boolean;
    updated_at: string;
    created_at: string;
  };
  city?: {
    id: number;
    name: string;
    state_id: number;
  };
  country?: {
    id: number;
    name: string;
  };
}

export type DocumentType =
  | "profilePicture"
  | "resumeFile"
  | "govIdDoc"
  | "certificateDoc"
  | null
  | undefined;

export interface DocumentOption {
  value: string;
  label: string;
}

export const documentType: DocumentOption[] = [
  { value: "govIdDoc", label: "Government Document" },
  { value: "certificateDoc", label: "Certificate Document" },
];
export interface walletViewData {
  id: number;
  dateTime: string;
  transactionId: string;
  transactionType: string;
  amount: string;
  status: string;
}

export interface ClientFormData {
  profileImage?: string | null;
  companyName: string;
  phoneNumber: string;
  industry: string;
  country: string;
  city: string;
  taxDocument: string;
  contactPersonName: string;
  businessType: string;
  address: string;
  state: string;
  postalCode: string;
  vatRegistrationNumber: string;
  governmentIDProof: string | null;
  qualificationCertificate: string | null;
}

export interface CompanyInfo {
  profileImage?: string;
  companyName: string;
  businessType: string;
  country: string;
  postalCode: string;
  contactPersonName: string;
  industry: string;
  state: string;
  taxDocument: string;
  phoneNumber: string;
  address: string;
  city: string;
  vatRegistrationNumber: string;
}

export interface BankCardData {
  bankName: string;
  cardNumber: string;
  bankAddress: string;
  ibanNumber: string;
  cardHolderName: string;
  swiftCode: string;
  walletBalance: string;
}

export interface PostedJobsProps {
  jObID: string;
  postedBy: string;
  jObTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDateTime: string;
  createdDate: string;
  status: boolean;
}

export interface CompletedJobsProps {
  id?: number;
  jObID: string;
  postedBy: string;
  jObTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDateTime: string;
  createdDate: string;
  status: boolean;
}

export interface DeclinedJobsProps {
  jObID: string;
  postedBy: string;
  jObTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDateTime: string;
  createdDate: string;
  status: boolean;
}

export interface FlaggedJobsProps {
  jObID: string;
  postedBy: string;
  jObTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDateTime: string;
  createdDate: string;
  status: boolean;
}

export interface InProgressJobsProps {
  jObID: string;
  postedBy: string;
  jObTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDateTime: string;
  createdDate: string;
  status: boolean;
}

export interface HoldJobsProps {
  jObID: string;
  postedBy: string;
  jObTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDateTime: string;
  createdDate: string;
  status: boolean;
}
