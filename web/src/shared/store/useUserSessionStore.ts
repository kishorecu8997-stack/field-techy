import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserSession {
  userId: string;
  role: string;
  accessToken: string;
  // metadata: Record<string, string>;
}

interface UserSessionStore {
  session: UserSession | null;
  setSession: (session: UserSession) => void;
  logout: () => void;
}

export const useUserSessionStore = create<UserSessionStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    { name: "generic-user-session" }
  )
);
