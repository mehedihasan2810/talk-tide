"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import { useChatStore } from "@/lib/stores/chatStores";

const Chat = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const groupName = useChatStore((state) => state.groupName);
  const groupParticipants = useChatStore((state) => state.groupParticipants);
  console.log(groupParticipants);
  console.log(selectedUser);
  console.log(groupName);
  return (
    <div className="sm:hidden">
      <Sidebar />
    </div>
  );
};

export default Chat;
