import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
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
      requestHandler<ChatInterface>(() =>
        apiClient.patch(`/chat/group/${chatId}`, {
          name: newGroupName,
        }),
      )(),
  });
};
