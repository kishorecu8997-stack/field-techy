import { create } from "zustand";
import type { GenericPopupProps } from "../components/popup/GenericPopup";

export type PopupConfig = Omit<GenericPopupProps, "onClose">;

type PopupState =
  | { isOpen: false; props: null }
  | { isOpen: true; props: PopupConfig };

type PopupStore = {
  popup: PopupState;
  showPopup: <T>(props: PopupConfig) => Promise<T>;
  closePopup: (result?: unknown) => void;
};

// Resolver for the current popup promise
let resolver: ((value: unknown) => void) | null = null;

export const usePopupStore = create<PopupStore>((set) => ({
  popup: { isOpen: false, props: null },

  showPopup: <T,>(props: PopupConfig): Promise<T> => {
    return new Promise<T>((resolve) => {
      resolver = resolve as (value: unknown) => void;
      set({
        popup: { isOpen: true, props },
      });
    });
  },

  closePopup: (result: unknown = null) => {
    resolver?.(result);
    resolver = null;

    set({
      popup: { isOpen: false, props: null },
    });
  },
}));
