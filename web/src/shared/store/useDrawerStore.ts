import { create } from "zustand";
import { profileCompletionData } from "@/pages/engineer/user_profile/profile_completion/profileCompletionData";
export type NavigationSource = "sidebar" | "profilecompletion" | "settings";
export type FieldStatus = "complete" | "pending" | "rejected";

interface DrawerState {
  activeKey: string;
  setActiveKey: (key: string, showBackButton?: boolean) => void;
  reset: () => void;
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
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
  // New additions for bank navigation back handling
  previousShowBack: boolean;
  goBack: () => void;
}

/**
 * Zustand store for managing global drawer/sidebar state, including the active menu key and sidebar open/closed status.
 */
const useDrawerStore = create<DrawerState>((set) => ({
  activeKey: "myAccount",
  setActiveKey: (key, showBackButton) =>
    set((state) => {
      const currentKey = state.activeKey;
      const newState: Partial<DrawerState> = {
        activeKey: key,
        showBackButton: showBackButton !== undefined ? showBackButton : true,
      };
      // New: If navigating from manageBankAccounts to a sub-view, remember the showBack
      if (
        currentKey === "manageBankAccounts" &&
        (key === "addBankdetails" || key === "editBankdetails")
      ) {
        newState.previousShowBack = state.showBackButton;
      }
      return newState;
    }),
  showBackButton: true,
  setShowBackButton: (show: boolean) => set({ showBackButton: show }),
  isOpenSidebar: false,
  setISOpenSidebar: (isOpen) => set({ isOpenSidebar: isOpen }),
  selectedId: "",
  setSelectedId: (id) => set({ selectedId: id }),
  navigationSource: "sidebar",
  returnToKey: undefined,
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
  reset: () =>
    set({
      activeKey: "myAccount",
      isOpenSidebar: false,
      selectedId: "",
      navigationSource: "sidebar",
      returnToKey: undefined,
      showBackButton: true,
    }),
  // New: For bank sub-nav back handling
  previousShowBack: true,
  goBack: () =>
    set((state) => {
      const currentKey = state.activeKey;
      if (currentKey === "addBankdetails" || currentKey === "editBankdetails") {
        // Return to manageBankAccounts with preserved showBack
        return {
          activeKey: "manageBankAccounts",
          showBackButton: state.previousShowBack,
        };
      } else {
        // Top-level: close the drawer (similar to reset but preserve other state if needed)
        return {
          isOpenSidebar: false,
        };
      }
    }),
}));

export default useDrawerStore;
