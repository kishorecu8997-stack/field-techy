import { create } from "zustand";

interface AdminProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePicture: string | null;
}

interface AdminProfileState {
    adminProfile: AdminProfile | null;
    setAdminProfile: (profile: AdminProfile) => void;
    updateAdminProfile: (updates: Partial<AdminProfile>) => void;
    clearAdminProfile: () => void;
}

export const useAdminProfileStore = create<AdminProfileState>((set) => ({
    adminProfile: null,
    setAdminProfile: (profile) => set({ adminProfile: profile }),
    updateAdminProfile: (updates) =>
        set((state) => ({
            adminProfile: state.adminProfile
                ? { ...state.adminProfile, ...updates }
                : null,
        })),
    clearAdminProfile: () => set({ adminProfile: null }),
}));
