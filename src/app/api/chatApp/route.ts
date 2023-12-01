import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { SessionUser } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
interface Session {
  user: SessionUser;
}
export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    throw new ApiError(401, "Unauthorized request!");
  }

  const msg = await req.json();

  console.log(session.user.id)

  await pusherServer.trigger(session.user.id, "msg", msg.message);

  return NextResponse.json({ message: "success" }, { status: 200 });
}
