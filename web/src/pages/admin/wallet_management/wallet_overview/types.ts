import type { adminJobsStatus } from "../../jobs/types";

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
  status?: adminJobsStatus;
}

export const StatusTypes = {
  Approve: "Approve",
  Pending: "Pending",
  Reject: "Reject",
} as const;

export type TransactionRequestStatus =
  (typeof StatusTypes)[keyof typeof StatusTypes];
