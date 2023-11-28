import { create } from "zustand";

interface ChatStore {
  isMobileSidebarOpen: boolean;
  isGroupDetailsModalOpen: boolean;

  toggleIsMobileSidebarOpen(): void;
  toggleGroupDetailsModal(_isGroupDetailsModalOpen: boolean): void;
}

export const useStore = create<ChatStore>((set) => ({
  // STATE
  isMobileSidebarOpen: false,
  isGroupDetailsModalOpen: false,
  // --------------------------

  // ACTION
  toggleIsMobileSidebarOpen: () =>
    set(({ isMobileSidebarOpen }) => ({
      isMobileSidebarOpen: !isMobileSidebarOpen,
    })),

  toggleGroupDetailsModal: (isGroupDetailsModalOpen) =>
    set({ isGroupDetailsModalOpen }),
}));
