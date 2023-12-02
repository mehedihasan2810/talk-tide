import { SuccessResponse } from "@/types/api";
import { AxiosResponse } from "axios";

type ApiCallback<T> = () => Promise<AxiosResponse<SuccessResponse<T>, any>>;

// A utility function for handling API requests with loading, success, and error handling
export const requestHandler = <T>(api: ApiCallback<T>) => {
  return async () => {
    try {
      const { data } = await api();
      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  };
};

// Check if the code is running in a browser environment
export const isBrowser = typeof window !== "undefined";
