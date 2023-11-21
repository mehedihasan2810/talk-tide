import { apiClient } from "@/lib/api";
import { ChatMessageInterface } from "@/types/chat";
import { requestHandler2 } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({
      chatId,
      formData,
    }: {
      chatId: string;
      formData: FormData;
    }) =>
      requestHandler2<ChatMessageInterface>(() =>
        apiClient.post(`/chat/messages/${chatId}`, formData),
      )(),
  });
};
