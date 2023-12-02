import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextRequest, NextResponse } from "next/server";
import { ServerSession } from "@/types/session";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import { ApiError } from "@/utils/error-helpers/ApiError";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { pusherServer } from "@/lib/pusher";
import { ChatEventEnum } from "@/utils/constants";
import { createAGroupChatValidator } from "@/utils/validators/createAGroupChatValidator";

export async function POST(req: NextRequest) {
  try {
    // get user from auth token
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const { name, participantIds } = createAGroupChatValidator(
      await req.json(),
    );

    // Check if user is not sending himself as a participant. This will be done manually
    if (participantIds.includes(session.user.id)) {
      throw new ApiError(
        400,
        "Participants array should not contain the group creator",
      );
    }
    // --------------------------------------------------

    const members = Array.from(new Set([...participantIds, session.user.id])); // check for duplicates

    if (members.length < 3) {
      // check after removing the duplicate
      // We want group chat to have minimum 3 members including admin
      throw new ApiError(
        400,
        "Seems like you have passed duplicate participants.",
      );
    }

    // Create a group chat with provided members
    const chat = await prisma.chat.create({
      data: {
        name: name,
        isGroupChat: true,
        participantIds: members,
        adminId: session.user.id,
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

    // logic to emit socket event about the new group chat added to the participants
    for (const participant of chat.participants) {
      if (participant.id === session.user.id) continue; // don't emit the event for the logged in use as he is the one who is initiating the chat
      // emit event to other participants with new chat as a payload

      await pusherServer.trigger(
        participant.id,
        ChatEventEnum.NEW_CHAT_EVENT,
        chat,
      );
    }

    return NextResponse.json(
      new ApiResponse(201, chat, "Group chat created successfully"),
      { status: 201 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
