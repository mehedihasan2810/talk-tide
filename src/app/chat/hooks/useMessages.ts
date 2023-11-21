import { apiClient } from "@/lib/api";
import { ChatMessageInterface } from "@/types/chat";
import { requestHandler2 } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useMessages = (id: string | null) => {
  return useQuery({
    queryKey: ["messages", id],
    queryFn: requestHandler2<ChatMessageInterface[]>(() =>
      apiClient.get(`/chat/messages/${id}`),
    ),
    enabled: !!id,
  });
};
