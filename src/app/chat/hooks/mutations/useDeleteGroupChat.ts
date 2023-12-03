import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useDeleteGroupChat = () => {
  return useMutation({
    mutationFn: (chatId: string) =>
      requestHandler<ChatInterface>(() =>
        apiClient.delete(`/chatApp/group/delete/${chatId}`),
      )(),
  });
};
