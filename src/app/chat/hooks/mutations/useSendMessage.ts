import { apiClient } from "@/lib/api";
import { ChatMessageInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({
      chatId,
      // formData
      content,
      image
    }: {
      chatId: string;
      // formData: FormData
      content: string,
      image: string
    }) =>
      requestHandler<ChatMessageInterface>(() =>
        apiClient.post(`/chatApp/messages/send/${chatId}`, {content, image}),
      )(),
  });
};
