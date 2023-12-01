import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useCreateNewGroupChat = () => {
  return useMutation({
    mutationFn: ({
      groupName,
      participantIds,
    }: {
      groupName: string;
      participantIds: string[];
    }) =>
      requestHandler<ChatInterface>(() =>
        apiClient.post("/chatApp/group/create", {
          name: groupName,
          participantIds,
        }),
      )(),
  });
};
