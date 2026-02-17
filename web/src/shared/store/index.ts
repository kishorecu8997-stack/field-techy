/**
 * Message history store
 */

import type { FCMMessage } from "./types/index";
import { create } from "zustand";

interface MessageWithTimestamp extends FCMMessage {
  receivedAt?: string;
}

interface MessageState {
  messages: MessageWithTimestamp[];
  addMessage: (message: FCMMessage) => void;
  clearMessages: () => void;
  removeMessage: (index: number) => void;
}

/**
 * Zustand store for managing received messages
 */
export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  addMessage: (message: FCMMessage) =>
    set((state) => ({
      messages: [
        {
          ...message,
          receivedAt: new Date().toISOString(),
        },
        ...state.messages,
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  removeMessage: (index: number) =>
    set((state) => ({
      messages: state.messages.filter((_, i) => i !== index),
    })),
}));

interface TokenState {
  token: string | null;
  registeredWithServer: boolean;
  isLoading: boolean;
  error: string | null;
  updateToken: (newToken: string | null) => void;
  setRegistrationStatus: (status: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

/**
 * Zustand store for token management
 */
export const useTokenStore = create<TokenState>((set) => ({
  token: null,
  registeredWithServer: false,
  isLoading: false,
  error: null,
  updateToken: (newToken) => set({ token: newToken, error: null }),
  setRegistrationStatus: (status) => set({ registeredWithServer: status }),
  setErrorMessage: (message) => set({ error: message }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
