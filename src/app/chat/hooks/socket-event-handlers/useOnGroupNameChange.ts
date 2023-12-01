import { queryClient } from "@/contexts/providers";
import { SuccessResponse } from "@/types/api";
import { ChatInterface } from "@/types/chat";

export const useOnGroupNameChange = (
) => {
  // Function to handle changes in group name
  const onGroupNameChange = (chat: ChatInterface) => {
    // Update the list of chats with the new chat details
    queryClient.setQueryData(
      ["chats"],
      (oldChats: SuccessResponse<ChatInterface[]>) => {
        return {
          ...oldChats,
          data: [
            // Map through the previous chats
            ...oldChats.data.map((c) => {
              // If the current chat in the map matches the chat being changed, return the updated chat
              if (c.id === chat.id) {
                return chat;
              }
              // Otherwise, return the chat as-is without any changes
              return c;
            }),
          ],
        };
      },
    );

    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  return onGroupNameChange;
};
