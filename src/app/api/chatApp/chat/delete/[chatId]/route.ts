import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { ChatEventEnum } from "@/utils/constants";
import { deleteCascadeChatMessages } from "@/socket/controllers/chat-controllers/deleteCascadeChatMessages";
import { ServerSession } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    // -------------------------------------------

    const chatId = params.chatId;

    if (!chatId) {
      throw new ApiError(400, "chat id missing!");
    }

    await deleteCascadeChatMessages(chatId); // first delete all the messages and attachments associated with the chat

    // delete the chat even if user is not admin because it's a personal chat
    const chat = await prisma.chat.delete({
      where: {
        id: chatId,
      },
      include: {
        // --------------
        participants: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            loginType: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        // ---------------------
        chatMessages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,

          include: {
            sender: {
              select: {
                username: true,
                avatar: true,
                email: true,
              },
            },
          },
        },
        // --------------------------
      },
    });
    // ----------------------------

    for (const participant of chat.participants) {
      // no need for logged in user to be notified
      if (participant.id === session.user.id) continue;

      // emit event to other participant with left chat as a payload
      await pusherServer.trigger(
        participant.id,
        ChatEventEnum.LEAVE_CHAT_EVENT,
        chat,
      );
    }

    return NextResponse.json(
      new ApiResponse(200, {}, "Chat deleted successfully"),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
