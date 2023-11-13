import { CreatChatSlice, createChatSlice } from "./storeSlices/createChatSlice";
import {
  CreateAsyncSlice,
  createAsyncSlice,
} from "./storeSlices/createAsyncSlice";
import {
  createSocketSlice,
  type CreateSocketSlice,
} from "./storeSlices/createSocketSlice";
import { create } from "zustand";

export const useStore = create<
  CreatChatSlice & CreateAsyncSlice & CreateSocketSlice
>()((...a) => ({
  ...createChatSlice(...a),
  ...createAsyncSlice(...a),
  ...createSocketSlice(...a),
}));
