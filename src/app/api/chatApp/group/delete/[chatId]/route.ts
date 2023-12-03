import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { ChatEventEnum } from "@/utils/constants";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextRequest, NextResponse } from "next/server";
import { deleteCascadeChatMessages } from "../../../chat/delete/[chatId]/deleteCascadeChatMessages";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { getServerSession } from "next-auth";
import { ServerSession } from "@/types/session";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as ServerSession;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const chatId = params.chatId;

    // throw error if theres no chat id
    if (!chatId) {
      throw new ApiError(400, "chat id is missing!");
    }

    // check for the group chat existence
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId as string,
        isGroupChat: true,
      },
      select: {
        id: true,
        adminId: true,
      },
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // check if the user who is deleting is the group admin
    if (groupChat.adminId !== session.user.id) {
      throw new ApiError(404, "Only admin can delete the group");
    }

    await deleteCascadeChatMessages(groupChat.id); // remove all messages and attachments associated with the chat

    // delete the chat
    const deletedChat = await prisma.chat.delete({
      where: {
        id: chatId as string,
      },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });
    //

    // logic to emit socket event about the group chat deleted to the participants
    for (const participant of deletedChat.participants) {
      if (participant.id === session.user.id) continue; // don't emit the event for the logged in use as he is the one who is deleting

      // emit event to other participants with left chat as a payload
      await pusherServer.trigger(
        participant.id,
        ChatEventEnum.LEAVE_CHAT_EVENT,
        deletedChat,
      );
    }

    return NextResponse.json(
      new ApiResponse(200, {}, "Group chat deleted successfully"),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
