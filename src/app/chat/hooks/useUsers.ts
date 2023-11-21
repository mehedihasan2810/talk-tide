import { apiClient } from "@/lib/api";
import { UserInterface } from "@/types/user";
import { requestHandler2 } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: requestHandler2<UserInterface[]>(() =>
      apiClient.get("/chat/users"),
    ),
  });
};
