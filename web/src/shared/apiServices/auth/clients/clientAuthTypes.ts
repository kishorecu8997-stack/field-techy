export interface ClientSignUpData {
  id?: string;
  phoneNumber?: string;
  email?: string;
  password?: string | null;
  clientType?: string;
  companyName?: string;
  contactPersonName?: string;
  businessType?: string;
  industry?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  taxDocumentVat?: string;
  vatRegistrationNumber?: string;
  profilePicture?: string;
  governmentIdProofDocument?: string;
  certificationQualificationsDocument?: string;
  enableNotifications?: boolean;
  isApproved?: boolean;
  vat?: string;
  fullName?: string;
  confirmPassword?: string;
}
