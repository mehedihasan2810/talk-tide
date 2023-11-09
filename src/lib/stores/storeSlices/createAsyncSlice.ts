import { StateCreator } from "zustand";
import { apiClient } from "../../api";
import { requestHandler } from "@/utils/requestHandler";
import { ChatListItemInterface } from "@/types/chat";

export interface CreateAsyncSlice {
  messages: string;
  isMessagesLoading: boolean;
  messagesError: string | null;
  sendMessage(_chatId: string, _content: string, _attachments: File[]): void;

  chats: ChatListItemInterface[];
  isChatsLoading: boolean;
  chatsError: string | null;
  getChats(): void;
}

export const createAsyncSlice: StateCreator<
  CreateAsyncSlice,
  [],
  [],
  CreateAsyncSlice
> = (set) => ({
  // fetch messages and store -------------------------
  isMessagesLoading: false,
  messagesError: null,
  messages: "",
  sendMessage: async (chatId, content, attachments) => {
    const formData = new FormData();

    if (content) {
      formData.append("content", content);
    }
    attachments?.map((file) => {
      formData.append("attachments", file);
    });

    requestHandler(
      // make request
      () => apiClient.post(`/chat/messages/${chatId}`, formData),
      // track loading status
      (loadingStatus) => set({ isMessagesLoading: loadingStatus }),
      // receive response and store
      (res) => {
        const { data } = res;
        set({ messages: data });
      },
      // handle error
      (error) => set({ messagesError: error }),
    );
  },
  // ----------------------------------------------------------------

  chats: [],
  isChatsLoading: false,
  chatsError: null,
  getChats: async () => {
    requestHandler(
      // make request
      () => apiClient.get("/chat/getAllChats"),
      // track loading status
      (loadingStatus) => set({ isChatsLoading: loadingStatus }),
      // receive response and store
      (res) => {
        const { data } = res;
        set({ chats: data });
      },
      // handle error
      (error) => set({ chatsError: error }),
    );
  },
});
