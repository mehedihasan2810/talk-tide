import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useCreateNewChat = () => {
  return useMutation({
    mutationFn: (selectedUserId: string) =>
      requestHandler<ChatInterface>(() =>
        apiClient.post(`/chat/c/${selectedUserId}`),
      )(),
  });
};
