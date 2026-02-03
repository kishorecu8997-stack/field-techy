export interface ManageClientProps {
      id: number;
    userId: number;
    clientType: string;
    companyName: string;
    personName: string;
    address: string;
    countryId: number;
    stateId: number;
    cityId: number;
    postalCode: string;
    industryId: number;
    documentType: string;
    documentNumber: string;
    profilePictureId: number | null;
    govIdDocId: number | null;
    certificateDocId: number | null;
    profileStatus: string;
    user: {
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
    city: {
      id: number;
      name: string;
      state_id: number;
    };
    country: {
      id: number;
      name: string;
    };
    balance: number;
    statusHistory: any[];
    clientCode: string;
    name: string;
    email: string;
    phoneNumber: string;
    location: string;
    registrationDate: string;
    userStatus: string;
}

export interface walletViewData {
  id: number;
  dateTime: string;
  transactionId: string;
  transactionType: string;
  amount: string;
  status: string;
}

interface ClientFormData {
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

interface CompanyInfo {
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
