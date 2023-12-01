import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { ServerSession } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }
    // ----------------------------------------------

    const chatId = params.chatId;

    if (!chatId) {
      throw new ApiError(400, "Chat id is required");
    }

    const selectedChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        participantIds: true,
      },
    });

    if (!selectedChat) {
      throw new ApiError(404, "Chat does not exist");
    }

    // Only send messages if the logged in user is a part of the chat he is requesting messages of
    if (!selectedChat.participantIds.includes(session.user.id)) {
      throw new ApiError(400, "User is not a part of this chat");
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId,
      },
      include: {
        sender: {
          select: {
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      new ApiResponse(200, messages || [], "Messages fetched successfully"),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
