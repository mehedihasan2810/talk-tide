import { apiClient } from "@/lib/api";
import { ChatListItemInterface } from "@/types/chat";
import { requestHandler2 } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useRenameGroup = () => {
  return useMutation({
    mutationFn: ({
      newGroupName,
      chatId,
    }: {
      newGroupName: string;
      chatId: string;
    }) =>
      requestHandler2<ChatListItemInterface>(() =>
        apiClient.patch(`/chat/group/${chatId}`, {
          name: newGroupName,
        }),
      )(),
  });
};
