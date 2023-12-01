import { queryClient } from "@/contexts/providers";
import { apiClient } from "@/lib/api";
import { SuccessResponse } from "@/types/api";
import { ChatInterface } from "@/types/chat";
import { requestHandler } from "@/utils/requestHandler";
import { useMutation } from "@tanstack/react-query";

export const useDeleteChat = () => {
  return useMutation({
    mutationFn: (chatId: string) =>
      requestHandler<ChatInterface>(() =>
        apiClient.delete(`/chatApp/chat/delete/${chatId}`),
      )(),

    onMutate: async (chatId: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      // Snapshot the previous value
      const prevChatsRes = queryClient.getQueryData([
        "chats",
      ]) as SuccessResponse<ChatInterface[]>;

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["chats"],
        (oldChatsRes: SuccessResponse<ChatInterface[]>) => ({
          ...oldChatsRes,
          data: oldChatsRes.data.filter((chat) => chat.id !== chatId),
        }),
      );

      // Return a context object with the snapshotted value
      return {
        ...prevChatsRes,
        data: [...prevChatsRes.data],
      } as SuccessResponse<ChatInterface[]>;
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newTodo, prevChatsRes) => {
      queryClient.setQueryData(["chats"], prevChatsRes);
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
