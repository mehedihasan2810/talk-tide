import { apiClient } from "@/lib/api";
import { ChatListItemInterface } from "@/types/chat";
import { requestHandler2 } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useGetGroupInfo = (chatId: string | null) => {
  return useQuery({
    queryKey: ["groupInfo"],
    queryFn: requestHandler2<ChatListItemInterface>(() =>
      apiClient.get(`/chat/group/${chatId}`),
    ),
    enabled: !!chatId,
  });
};
