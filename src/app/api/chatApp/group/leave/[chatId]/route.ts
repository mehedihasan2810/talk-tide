import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { ChatEventEnum } from "@/socket/constants";
import { ServerSession } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }
    // ----------------------------------------------

    // const { chatId } = req.query as { chatId: string | undefined };

    const chatId = params.chatId;

    if (!chatId) {
      throw new ApiError(400, "chat id is missing");
    }

    //  check if it is a group chat --------------------
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroupChat: true,
      },
      select: {
        participantIds: true,
      },
    });

    //   ------------------------------------------------

    if (!groupChat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // check if the participant that is leaving the group, is part of the group
    if (!groupChat.participantIds.includes(session.user.id)) {
      throw new ApiError(400, "You are not a part of this group chat");
    }

    // leave the chat
    const updatedParticipantIds = groupChat.participantIds.filter(
      (id) => id !== session.user.id,
    );

    // update the chat
    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        participantIds: {
          set: updatedParticipantIds,
        },
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

    // emit leave chat event to the removed participant
    await pusherServer.trigger(
      session.user.id,
      ChatEventEnum.LEAVE_CHAT_EVENT,
      updatedChat,
    );

    return NextResponse.json(
      new ApiResponse(200, updatedChat, "Left a group successfully"),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
