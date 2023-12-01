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
  { params }: { params: { slug: string[] } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    console.log(params)

    const chatId = params.slug[0];
    const participantId = params.slug[1];

    if (!chatId) {
      throw new ApiError(400, "Chat id is required");
    }

    if (!participantId) {
      throw new ApiError(400, "Participant id is required");
    }

    // check if chat is a group
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroupChat: true,
      },
      select: {
        participantIds: true,
        adminId: true,
      },
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // check if user who is deleting is a group admin
    if (groupChat.adminId !== session.user.id) {
      throw new ApiError(404, "You are not an admin");
    }

    if (participantId === session.user.id) {
      throw new ApiError(400, "Admin can not be removed.");
    }

    // check if the participant that is being removed in a part of the group
    if (!groupChat.participantIds.includes(participantId)) {
      throw new ApiError(400, "Participant does not exist in the group chat");
    }

    //   remove the participant
    const updatedParticipantIds = groupChat.participantIds.filter(
      (id) => id !== participantId,
    );

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
      },
    });

    // emit leave chat event to the removed participant
    await pusherServer.trigger(
      participantId,
      ChatEventEnum.LEAVE_CHAT_EVENT,
      updatedChat,
    );

    return NextResponse.json(
      new ApiResponse(200, updatedChat, "Participant removed successfully"),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
