import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";
type Query = {
  slug: string[];
};
export const removeParticipantFromGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const { slug } = req.query as Query;

  const chatId = slug[0];
  const participantId = slug[1];

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
  if (groupChat.adminId !== req.cookies.id) {
    throw new ApiError(404, "You are not an admin");
  }

  // check if the participant that is being removed in a part of the group
  if (!groupChat.participantIds.includes(participantId)) {
    throw new ApiError(400, "Participant does not exist in the group chat");
  }

  //   remove the participant
  const updatedParticipantIds = groupChat.participantIds.filter(
    (id) => id !== participantId
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

  if (!updatedChat) {
    throw new ApiError(500, "Internal server error");
  }

  // emit leave chat event to the removed participant
  emitSocketEvent(
    res.socket.server.io,
    participantId,
    ChatEventEnum.LEAVE_CHAT_EVENT,
    updatedChat
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedChat, "Participant removed successfully")
    );
};
