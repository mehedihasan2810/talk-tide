import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useLeaveGroupChat = () => {
  return useMutation({
    mutationFn: (chatId: string) =>
      requestHandler<ChatInterface>(() =>
        apiClient.patch(`/chatApp/group/leave/${chatId}`),
      )(),
  });
};
