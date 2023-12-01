import { apiClient } from "@/lib/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: requestHandler<ChatInterface[]>(() =>
      apiClient.get("/chatApp/chat/get"),
    ),
  });
};
