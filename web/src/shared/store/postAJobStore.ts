import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const CurrentLocation = {
  dedicated: "dedicated",
  dispatch: "dispatch",
  scheduled: "scheduled",
};
export type currentLocationType =
  (typeof CurrentLocation)[keyof typeof CurrentLocation];

type PostAJobStoreStore = {
  isPostAJobOpen: boolean;
  currentLocation: currentLocationType | null;
  setCurrentLocation: (location: currentLocationType) => void;
  setIsPostAJobOpen: (isOpen: boolean) => void;
};

const usePostAJobStore = create<PostAJobStoreStore>()(
  persist(
    (set) => ({
      isPostAJobOpen: false,
      currentLocation: null,
      setCurrentLocation: (location: currentLocationType) =>
        set({ currentLocation: location }),
      setIsPostAJobOpen: (isOpen: boolean) => set({ isPostAJobOpen: isOpen }),
    }),
    {
      name: "post-a-job-store",
      storage: createJSONStorage(() => localStorage), // ✅ THIS FIXES YOUR ERROR
    },
  ),
);

export default usePostAJobStore;
