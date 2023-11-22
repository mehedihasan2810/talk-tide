import { queryClient } from "@/contexts/providers";
import { SuccessResponse } from "@/types/api";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";

type UseUpdateChatLastMessage = (
  _chats:
    | SuccessResponse<ChatInterface[]>
    | {
        data: never[];
      },
) => Function;

export const useUpdateChatLastMessage: UseUpdateChatLastMessage = (chats) => {
  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface, // The new message to be set as the last message
  ) => {
    // Search for the chat with the given ID in the chats array
    const chatToUpdate = chats.data.find((chat) => chat.id === chatToUpdateId)!;

    // Update the 'lastMessage' field of the found chat with the new message
    chatToUpdate.chatMessages = [message];

    // Update the 'updatedAt' field of the chat with the 'updatedAt' field from the message
    chatToUpdate.updatedAt = message?.updatedAt;

    queryClient.setQueryData(
      ["chats"],
      (oldChats: SuccessResponse<ChatInterface[]>) => {
        return {
          ...oldChats,
          data: [
            chatToUpdate, // Place the updated chat first
            ...oldChats.data.filter((chat) => chat.id !== chatToUpdateId), // Include all other chats except the updated one
          ],
        };
      },
    );

    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  return updateChatLastMessage;
};
