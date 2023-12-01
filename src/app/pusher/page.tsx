"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";
import { pusherClient } from "@/lib/pusher";
import { SessionUser } from "@/types/session";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Pusher = () => {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth");
    },
  });
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const msgHandler = (msg: string) => {
    console.log(msg);
    setMessages((m) => [msg, ...m]);
  };

  useEffect(() => {
    if (status === "loading") return;
    const myEvent = pusherClient.subscribe((session.user as SessionUser).id);

    myEvent.bind("msg", msgHandler);

    return () => {
      pusherClient.unsubscribe((session.user as SessionUser).id);

      myEvent.unbind("msg", msgHandler);
    };
  }, [status]);

  return (
    <div className="fixed z-50 grid h-full w-full place-items-center">
      <div>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
        <Input
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          type="text"
          placeholder="type a message"
        />
        <Button
          onClick={async () => {
            const res = await apiClient.post("/chatApp", { message: msg });
            console.log(res);
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
