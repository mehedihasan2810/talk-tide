import { apiClient } from "@/lib/api";
import { ChatMessageInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
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
      requestHandler<ChatMessageInterface>(() =>
        apiClient.post(`/chatApp/messages/send/${chatId}`, formData),
      )(),
  });
};
