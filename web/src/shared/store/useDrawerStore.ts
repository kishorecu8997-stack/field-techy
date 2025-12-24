import { create } from "zustand";
import { profileCompletionData, type FieldStatus } from "@/pages/engineer/user_profile/profile_completion/profileCompletionData";
export type NavigationSource = "sidebar" | "profilecompletion" | "settings";
export type { FieldStatus };

interface DrawerState {
  activeKey: string;
  setActiveKey: (key: string) => void;
  reset: () => void;
  isOpenSidebar: boolean;
  setISOpenSidebar: (isOpen: boolean) => void;
  selectedId: string | number;
  setSelectedId: (id: string | number) => void;
  // Add Navigation function for drawer to redirect to the page that is opened
  navigationSource: NavigationSource;
  returnToKey?: string;
  immediateParentKey?: string; // For nested forms to return to section
  setNavigationSource: (source: NavigationSource, returnToKey?: string) => void;
  setImmediateParentKey: (key?: string) => void;
  resetNavigationSource: () => void;
  //  Profile completion  UI Only state
  profileData: typeof profileCompletionData;
  updateFieldStatus: (
    sectionKey: string,
    fieldLabel: string,
    status: FieldStatus
  ) => void;
}

/**
 * Zustand store for managing global drawer/sidebar state, including the active menu key and sidebar open/closed status.
 */
const useDrawerStore = create<DrawerState>((set) => ({
  reset: () =>
    set({
      activeKey: "myAccount",
      isOpenSidebar: false,
      selectedId: "",
      navigationSource: "sidebar",
      returnToKey: undefined,
      profileData: profileCompletionData,
    }),
  activeKey: "myAccount",
  setActiveKey: (key) => set({ activeKey: key }),

  isOpenSidebar: false,
  setISOpenSidebar: (isOpen) => set({ isOpenSidebar: isOpen }),

  selectedId: "",
  setSelectedId: (id) => set({ selectedId: id }),

  navigationSource: "sidebar",
  returnToKey: undefined,
  immediateParentKey: undefined,

  setNavigationSource: (source, returnToKey) =>
    set({ navigationSource: source, returnToKey }),

  setImmediateParentKey: (key) => set({ immediateParentKey: key }),

  resetNavigationSource: () =>
    set({ navigationSource: "sidebar", returnToKey: undefined }),

  // UI-only profile completion state
  profileData: profileCompletionData,
  updateFieldStatus: (sectionKey, fieldLabel, status) =>
    set((state) => ({
      profileData: state.profileData.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.label === fieldLabel ? { ...field, status } : field
              ),
            }
          : section
      ),
    })),
}));

export default useDrawerStore;
