import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useAddParticipant = () => {
  return useMutation({
    mutationFn: ({
      chatId,
      participantToBeAdded,
    }: {
      chatId: string;
      participantToBeAdded: string;
    }) =>
      requestHandler<ChatInterface>(() =>
        apiClient.post(
          `/chatApp/group/participant/add/${chatId}/${participantToBeAdded}`,
        ),
      )(),
  });
};
