import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const CurrentLocation = {
  dedicated: "dedicated",
  dispatch: "dispatch",
  scheduled: "scheduled",
  fullTime: "fullTime",
  onDemand: "onDemand",
};
export type currentLocationType =
  (typeof CurrentLocation)[keyof typeof CurrentLocation];

type PostAJobStoreStore = {
  isPostAJobOpen: boolean;
  currentLocation: currentLocationType | null;
  rate: string;
  currencyId: number;
  currencySymbol: string;
  amount: string;
  setAmount: (amount: string) => void;
  setCurrentLocation: (location: currentLocationType) => void;
  setIsPostAJobOpen: (isOpen: boolean) => void;
  setRateAndCurrency: (rate: string, currencyId: number) => void;
  clearRateAndCurrency: () => void;
  setCurrencySymbol: (currencySymbol: string) => void;
};

const usePostAJobStore = create<PostAJobStoreStore>()(
  persist(
    (set) => ({
      isPostAJobOpen: false,
      currentLocation: null,
      rate: "",
      currencyId: 0,
      currencySymbol: "",
      amount: "",
      setAmount: (amount: string) => set({ amount }),
      setCurrentLocation: (location: currentLocationType) =>
        set({ currentLocation: location }),
      setIsPostAJobOpen: (isOpen: boolean) => set({ isPostAJobOpen: isOpen }),
      setRateAndCurrency: (rate: string, currencyId: number) =>
        set({ rate, currencyId }),
      clearRateAndCurrency: () => set({ rate: "", currencyId: 0 }),
      setCurrencySymbol: (currencySymbol: string) => set({ currencySymbol }),
    }),
    {
      name: "post-a-job-store",
      storage: createJSONStorage(() => localStorage), // ✅ THIS FIXES YOUR ERROR
    },
  ),
);

export default usePostAJobStore;
