import { queryClient } from "@/contexts/providers";
import { SuccessResponse } from "@/types/api";
import { ChatInterface } from "@/types/chat";

export const useOnNewChat = () => {
  const onNewChat = (chat: ChatInterface) => {
    queryClient.setQueryData(
      ["chats"],
      (oldChats: SuccessResponse<ChatInterface[]>) => {
        return {
          ...oldChats,
          data: [chat, ...oldChats.data],
        };
      },
    );

    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  return onNewChat;
};
