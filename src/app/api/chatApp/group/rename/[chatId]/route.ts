import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { ChatEventEnum } from "@/utils/constants";
import { ServerSession } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const chatId = params.chatId;
    const { name } = await req.json();

    // throw error if theres no chat id
    if (!chatId) {
      throw new ApiError(400, "chat id is missing!");
    }

    // throw error if theres no name
    if (!name) {
      throw new ApiError(400, "group name is missing!");
    }

    // check for chat existence
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId as string,
        isGroupChat: true,
      },
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // only admin can change the name
    if (groupChat.adminId !== session.user.id) {
      throw new ApiError(404, "You are not an admin");
    }

    //   update the group name and retrieve necessary data
    const updateGroupChat = await prisma.chat.update({
      where: {
        id: chatId as string,
      },
      data: {
        name,
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

    // logic to emit socket event about the updated chat name to the participants
    for (const participant of updateGroupChat.participants) {
      // emit event to all the participants with updated chat as a payload
      await pusherServer.trigger(
        participant.id,
        ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
        updateGroupChat,
      );
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        updateGroupChat,
        "Group chat name updated successfully",
      ),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
