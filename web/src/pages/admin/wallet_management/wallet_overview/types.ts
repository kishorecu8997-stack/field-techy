export interface EngineerPage {
  sno: number;
  details: DetailsTypes;
  walletBalance: number;
}

export interface DetailsTypes {
  name: string;
  phone: string;
}

export interface TransactionRequest {
  sno: number;
  details: DetailsTypes;
  walletBalance: number;
  status: string;
}
