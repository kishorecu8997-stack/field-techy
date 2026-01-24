import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserSession {
  userId: string;
  role: string;
  email?: string;
  accessToken: string;
  initiatedAt: number; // Timestamp when session was created (in milliseconds)
  // metadata: Record<string, string>;
}

interface UserSessionStore {
  session: UserSession | null;
  setSession: (session: UserSession) => void;
  logout: () => void;
}

interface ForgotSessionStore {
  token: { token: string | null };
  setToken: (token: { token: string | null }) => void;
}

export const useUserSessionStore = create<UserSessionStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    { name: "generic-user-session" },
  ),
);

export const forgotSession = create<ForgotSessionStore>()(
  persist(
    (set) => ({
      token: { token: null },
      setToken: (token) => set({ token }),
    }),
    { name: "forgot-user-session" },
  ),
);
