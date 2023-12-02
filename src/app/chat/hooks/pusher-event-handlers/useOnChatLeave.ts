import { queryClient } from "@/contexts/providers";
import { SuccessResponse } from "@/types/api";
import { ChatInterface } from "@/types/chat";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MutableRefObject } from "react";

export const useOnChatLeave = (
  currentChatIdRef: MutableRefObject<string | null>,
  pathname: string | null,
  router: AppRouterInstance,
  deleteQueryString: (..._keys: string[]) => string,
) => {
  // This function handles the event when a user leaves a chat.
  const onChatLeave = (chat: ChatInterface) => {
    // Check if the chat the user is leaving is the current active chat.
    if (chat.id === currentChatIdRef.current) {
      // If the user is in the group chat they're leaving, close the chat window.
      currentChatIdRef.current = null;
      router.replace(pathname + deleteQueryString("c"));
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
