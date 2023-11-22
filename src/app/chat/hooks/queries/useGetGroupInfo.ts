import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useGetGroupInfo = (chatId: string | null) => {
  return useQuery({
    queryKey: ["groupInfo"],
    queryFn: requestHandler<ChatInterface>(() =>
      apiClient.get(`/chat/group/${chatId}`),
    ),
    enabled: !!chatId,
  });
};
