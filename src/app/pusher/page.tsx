"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";
import { pusherClient } from "@/lib/pusher";
import React, { useEffect, useState } from "react";

const Pusher = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const myEvent = pusherClient.subscribe("my-event");

    const msgHandler = (msg: string) => {
      console.log(msg);
      setMessages((m) => [msg, ...m]);
    };

    myEvent.bind("msg", msgHandler);

    return () => {
      pusherClient.unsubscribe("my-event");

      myEvent.unbind("msg", msgHandler);
    };
  }, []);

  return (
    <div className="fixed z-50 grid h-full w-full place-items-center">
      <div>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
        <Input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          type="text"
          placeholder="type a message"
        />
        <Button
          onClick={async () => {
            await apiClient.post("/chat-app", { message: msg });
            setMsg("");
          }}
        >
          send
        </Button>
      </div>
    </div>
  );
};

export default Pusher;
