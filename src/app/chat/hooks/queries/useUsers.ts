import { apiClient } from "@/lib/api";
import { UserInterface } from "@/types/user";
import { requestHandler } from "@/utils/requestHandler";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: requestHandler<UserInterface[]>(() =>
      apiClient.get("/chatApp/users"),
    ),
  });
};
