import { create } from "zustand";

interface State {
  isGroupChat: boolean;
  groupName: string;
  selectedUser: string | null;
  groupParticipants: string[];
}

interface Action {
  updateIsGroupChat(_a: boolean): void;
  updateGroupName(_a: string): void;
  updateSelectedUser(_a: string): void;
  updateGroupParticipants(_a: string): void;
}

export const useChatStore = create<State & Action>((set) => ({
  // STATE
  isGroupChat: false,
  groupName: "",
  selectedUser: null,
  groupParticipants: [],

  // ACTION
  updateIsGroupChat: (isGroupChat) => set(() => ({ isGroupChat })),
  updateGroupName: (groupName) => set(() => ({ groupName })),
  updateSelectedUser: (selectedUser) => set(() => ({ selectedUser })),
  updateGroupParticipants: (groupParticipant) =>
    set((state: State) => {
      const participants = state.groupParticipants.includes(groupParticipant)
        ? state.groupParticipants
        : [...state.groupParticipants, groupParticipant];

      return { groupParticipants: participants };
    }),
}));
