import { UserInterface } from "./user";

export interface ChatListItemInterface {
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
  content: string;
  chat: string;
  attachments: {
    url: string;
    localPath: string;
    id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
