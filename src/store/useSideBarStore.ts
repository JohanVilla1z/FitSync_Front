import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: true,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
