export interface TransactionProps {
  transactionId: string;
  clientDetails: ClientDetailsType;
  jobTitle: string;
  jobDescription: string;
  amount: string;
  engineerDetails: EngineerDetailsType;
  paymentStatus: string;
}

export interface ClientDetailsType {
  name: string;
  email: string;
  phone: string;
}

export interface EngineerDetailsType {
  name: string;
  email: string;
  phone: string;
}
