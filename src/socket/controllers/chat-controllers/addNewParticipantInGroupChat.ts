import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

type Query = {
  slug: string[];
};

export const addNewParticipantInGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }

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

  // check if user who is adding is a group admin
  if (groupChat.adminId !== tokenUser.id) {
    throw new ApiError(404, "You are not an admin");
  }

  // check if the participant that is being added in a part of the group
  if (groupChat.participantIds.includes(participantId)) {
    throw new ApiError(409, "Participant already in group chat");
  }

  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      participantIds: {
        push: participantId,
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

  // emit new chat event to the added participant
  emitSocketEvent(
    res.socket.server.io,
    participantId,
    ChatEventEnum.NEW_CHAT_EVENT,
    updatedChat,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Participant added successfully"));
};
