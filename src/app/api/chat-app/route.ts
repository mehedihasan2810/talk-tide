import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const msg = await req.json();

  pusherServer.trigger("my-event", "msg", msg.message);

  return NextResponse.json({ message: "success" }, { status: 200 });
}
