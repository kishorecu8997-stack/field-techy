import type { AdminGetClientResponse } from "@/api";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";

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
  govIdDoc?: {
    fileId?: number;
    url?: string;
    mimeType?: string;
  };
  certificateDoc?: {
    fileId?: number;
    url?: string;
    mimeType?: string;
  };
  profilePicture?: {
    fileId?: number;
    url?: string;
    mimeType?: string;
  };
}

export interface ExtendedClientResponse extends AdminGetClientResponse {
  vatRegistrationNumber?: string;
}

export interface ClientFormProps {
  isEdit?: boolean;
}

export interface ClientAddProps {
  isEdit?: boolean;
  isView?: boolean;
}

export interface ViewFileComponentProps {
  onClose: () => void;
  title?: string;
  fileType: ProfileFileType | null;
  fileUrl?: string | null;
  isShowIcon?: boolean;
  titleClassName?: string;
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

export type BlockClientForm = {
  reason: string;
};

export interface BlockClientProps {
  userId?: number;
  isBlockClient: boolean;
  setIsBlockClient: (isOpen: boolean) => void;
  onSuccess?: () => void;
}


export interface walletViewData {
  id: number;
  dateTime: string;
  transactionId: string;
  transactionType: string;
  amount: string;
  status: string;
}

export interface ClientFormData {
  clientType: "corporate" | "home";
  profileImage?: string | File | null;
  companyName?: string;
  phoneNumber: string;
  email: string;
  industry?: string | number;
  country: string | number;
  city: string | number;
  documentType?: string;
  contactPersonName: string;
  businessType?: string | number;
  address?: string;
  state: string | number;
  postalCode: string;
  documentNumber?: string;
  govIdDoc?: string | File | FileList | null;
  certificate?: string | File | FileList | null;
}

export interface CompanyInfo {
  profileImage?: string;
  clientType?: "corporate" | "home";
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
  documentNumber: string;
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
