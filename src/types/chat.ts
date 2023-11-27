import { UserInterface } from "./user";

export interface ChatInterface {
  id: string;
  adminId: string;
  isGroupChat: true;
  chatMessages: ChatMessageInterface[];
  name: string;
  participantIds: string[];
  participants: UserInterface[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageInterface {
  id: string;
  sender: Pick<UserInterface, "id" | "avatar" | "email" | "username">;
  senderId: string;
  content: string;
  chatId: string;
  attachments: {
    // id: string;
    url: string;
    localPath: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
