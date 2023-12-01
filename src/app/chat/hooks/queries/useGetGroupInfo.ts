import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useGetGroupInfo = (chatId: string | null) => {
  return useQuery({
    queryKey: ["groupInfo", chatId],
    queryFn: requestHandler<ChatInterface>(() =>
      apiClient.get(`/chatApp/group/getDetails/${chatId}`),
    ),
    enabled: !!chatId,
  });
};
