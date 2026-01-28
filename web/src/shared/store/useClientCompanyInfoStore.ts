import { create } from "zustand";
import { type ClientGetCompanyInfoResponse } from "@/api";

interface ClientCompanyInfoState {
  companyInfo: ClientGetCompanyInfoResponse | null;
  setCompanyInfo: (info: ClientGetCompanyInfoResponse | null) => void;
  clearCompanyInfo: () => void;
}

export const useClientCompanyInfoStore = create<ClientCompanyInfoState>((set) => ({
  companyInfo: null,
  setCompanyInfo: (info) => set({ companyInfo: info }),
  clearCompanyInfo: () => set({ companyInfo: null }),
}));
