import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useRemoveParticipant = () => {
  return useMutation({
    mutationFn: ({
      chatId,
      participantToBeRemoved,
    }: {
      chatId: string;
      participantToBeRemoved: string;
    }) =>
      requestHandler<ChatInterface>(() =>
        apiClient.patch(
          `/chatApp/group/participant/remove/${chatId}/${participantToBeRemoved}`,
        ),
      )(),
  });
};
