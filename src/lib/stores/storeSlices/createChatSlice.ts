import { StateCreator } from "zustand";

export interface CreatChatSlice {
  isGroupChat: boolean;
  groupName: string;
  selectedUser: string | null;
  groupParticipants: string[];
  isMobileSidebarOpen: boolean;

  updateIsGroupChat(_a: boolean): void;
  updateGroupName(_a: string): void;
  updateSelectedUser(_a: string): void;
  removeSelectedUser(_a: string): void;
  updateGroupParticipants(_a: string): void;
  removeGroupParticipants(_a: string): void;
  toggleIsMobileSidebarOpen(): void;
}

export const createChatSlice: StateCreator<
  CreatChatSlice,
  [],
  [],
  CreatChatSlice
> = (set) => ({
  // STATE
  isGroupChat: false,
  groupName: "",
  selectedUser: null,
  groupParticipants: [],
  isMobileSidebarOpen: false,
  // --------------------------

  // ACTION
  updateIsGroupChat: (isGroupChat) => set(() => ({ isGroupChat })),
  updateGroupName: (groupName) => set(() => ({ groupName })),
  updateSelectedUser: (selectedUser) => set(() => ({ selectedUser })),
  removeSelectedUser: () => set(() => ({ selectedUser: null })),
  updateGroupParticipants: (groupParticipant) =>
    set(({ groupParticipants }) => {
      // avoid duplicating participants ----------
      const participants = groupParticipants.includes(groupParticipant)
        ? groupParticipants
        : [...groupParticipants, groupParticipant];
      // -----------------------------------------

      return {
        groupParticipants: participants,
      };
    }),
  removeGroupParticipants: (id) =>
    set((state) => ({
      groupParticipants: state.groupParticipants.filter((item) => item !== id),
    })),
  toggleIsMobileSidebarOpen: () =>
    set(({ isMobileSidebarOpen }) => ({
      isMobileSidebarOpen: !isMobileSidebarOpen,
    })),
  // ------------------------------------------
});
