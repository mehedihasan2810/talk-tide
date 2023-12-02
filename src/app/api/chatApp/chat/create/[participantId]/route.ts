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

export async function POST(
  _req: NextRequest,
  { params }: { params: { participantId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const participantId = params.participantId;

    if (!participantId) {
      throw new ApiError(400, "participant id missing!");
    }

    // Check if it's a valid receiver
    const receiver = await prisma.user.findUnique({
      where: {
        id: participantId,
      },
      select: {
        id: true,
      },
    });

    // if not then throw error -
    if (!receiver) {
      throw new ApiError(404, "Participant does not exist");
    }

    // check if receiver is not the user who is requesting a chat
    if (receiver.id === session.user.id) {
      throw new ApiError(400, "You cannot chat with yourself");
    }

    const chat = await prisma.chat.findMany({
      where: {
        isGroupChat: false, // avoid group chats. This controller is responsible for one on one chats

        // Also, filter chats with participants having receiver and logged in user only
        AND: [
          {
            participantIds: {
              has: session.user.id,
            },
          },
          {
            participantIds: {
              has: participantId,
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (chat.length) {
      throw new ApiError(400, "Chat already exist");
    }

    // if not we need to create a new one on one chat
    const createdChat = await prisma.chat.create({
      data: {
        name: "One on one chat",
        participantIds: [session.user.id, participantId], // add receiver and logged in user as participants
        adminId: session.user.id,
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

    // logic to emit socket event about the new chat added to the participants
    for (const participant of createdChat.participants) {
      if (participant.id === session.user.id) continue; // don't emit the event for the logged in use as he is the one who is initiating the chat

      // emit event to other participants with new chat as a payload
      await pusherServer.trigger(
        participant.id,
        ChatEventEnum.NEW_CHAT_EVENT,
        createdChat,
      );
    }

    return NextResponse.json(
      new ApiResponse(201, createdChat, "Chat created successfully"),
      { status: 201 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
