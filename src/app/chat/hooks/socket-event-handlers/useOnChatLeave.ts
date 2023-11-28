import { queryClient } from "@/contexts/providers";
import { SuccessResponse } from "@/types/api";
import { ChatInterface } from "@/types/chat";
import { MutableRefObject } from "react";

export const useOnChatLeave = (
  currentChatIdRef: MutableRefObject<string | null>,
) => {
  // This function handles the event when a user leaves a chat.
  const onChatLeave = (chat: ChatInterface) => {
    // Check if the chat the user is leaving is the current active chat.
    if (chat.id === currentChatIdRef.current) {
      // If the user is in the group chat they're leaving, close the chat window.
      currentChatIdRef.current = null;
    }

    // Update the chats by removing the chat that the user left.
    queryClient.setQueryData(
      ["chats"],
      (oldChats: SuccessResponse<ChatInterface[]>) => {
        return {
          ...oldChats,
          data: oldChats.data.filter((c) => c.id !== chat.id),
        };
      },
    );

    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  return onChatLeave;
};
