import { create } from 'zustand';

interface DrawerState {
  activeKey: string;
  setActiveKey: (key: string) => void;
  reset: () => void;
  isOpenSidebar: boolean;
  setISOpenSidebar: (isOpen: boolean) => void;
}

/**
 * Zustand store for managing global drawer/sidebar state, including the active menu key and sidebar open/closed status.
 */
const useDrawerStore = create<DrawerState>((set) => ({  
  activeKey: 'clientNotification',
  
  setActiveKey: (key) => set({ activeKey: key }),  
  reset: () => set({ activeKey: 'clientNotification' }),
  isOpenSidebar: false,
  setISOpenSidebar: (isOpen) => set({ isOpenSidebar: isOpen }),

}));

export default useDrawerStore;