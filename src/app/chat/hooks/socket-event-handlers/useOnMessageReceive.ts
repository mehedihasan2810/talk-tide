import { queryClient } from "@/contexts/providers";
import { SuccessResponse } from "@/types/api";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";
import React, { MutableRefObject } from "react";
import { useUpdateChatLastMessage } from "./useUpdateChatLastMessage";

type UserOnMessageReceive = (
  _currentChatIdRef: MutableRefObject<string | null>,

  _setUnreadMessages: React.Dispatch<
    React.SetStateAction<ChatMessageInterface[]>
  >,

  _chats:
    | SuccessResponse<ChatInterface[]>
    | {
        data: never[];
      },
      
) => (..._args: any[]) => void;

export const useOnMessageReceive: UserOnMessageReceive = (
  currentChatIdRef,
  setUnreadMessages,
  chats,
) => {
  const updateChatLastMessage = useUpdateChatLastMessage(chats);

  const onMessageReceive = (message: ChatMessageInterface) => {
    console.log(message)
    // Check if the received message belongs to the currently active chat
    if (message.chatId !== currentChatIdRef.current) {
      // If not, update the list of unread messages
      setUnreadMessages((prevMessages) => [message, ...prevMessages]);
    } else {
      // If it belongs to the current chat, update the messages list for the active chat

      queryClient.setQueryData(
        ["messages", message.chatId],
        (oldMessages: SuccessResponse<ChatMessageInterface[]>) => {
          return {
            ...oldMessages,
            data: [message, ...oldMessages.data],
          };
        },
      );

      // queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["messages", message.chatId] });
    }

    // Update the last message for the chat to which the received message belongs
    updateChatLastMessage(message.chatId || "", message);
  };

  return onMessageReceive;
};
