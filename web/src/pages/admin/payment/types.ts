export interface PaymentProps {
  id: string;
  clientDetails: ClientDetailsType;
  jobTitle: string;
  jobDescription: string;
  amount: string;
  engineerDetails: string;
  clientStatus: string;
  adminStatus: string;
}

export interface ClientDetailsType {
  name: string;
  email: string;
  phone: string;
}
