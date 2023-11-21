import { apiClient } from "@/lib/api";
import { ChatListItemInterface } from "@/types/chat";
import { requestHandler2 } from "@/utils/requestHandler";
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
      requestHandler2<ChatListItemInterface>(() =>
        apiClient.delete(
          `/chat/group/addParticipant/${chatId}/${participantToBeRemoved}`,
        ),
      )(),
  });
};
