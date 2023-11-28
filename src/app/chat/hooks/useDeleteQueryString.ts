import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useDeleteQueryString = () => {
  const searchParams = useSearchParams()!;
  return useCallback(
    (...keys: string[]) => {
      const params = new URLSearchParams(searchParams);
      keys.forEach((key) => params.delete(key));

      return "?" + params.toString();
    },
    [searchParams],
  );
};
