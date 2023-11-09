import { CreatChatSlice, createChatSlice } from "./storeSlices/createChatSlice";
import {
  CreateAsyncSlice,
  createAsyncSlice,
} from "./storeSlices/createAsyncSlice";
import { create } from "zustand";

export const useStore = create<CreatChatSlice & CreateAsyncSlice>()((...a) => ({
  ...createChatSlice(...a),
  ...createAsyncSlice(...a),
}));
