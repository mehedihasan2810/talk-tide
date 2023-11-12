import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

export const leaveGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }
  // ----------------------------------------------

  const { chatId } = req.query as { chatId: string | undefined };

  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "chat id is missing");
  }

  //  check it is a group chat --------------------
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
  if (!groupChat.participantIds.includes(tokenUser.id)) {
    throw new ApiError(400, "You are not a part of this group chat");
  }

  // leave the chat 
  const updatedParticipantIds = groupChat.participantIds.filter(
    (id) => id !== tokenUser.id,
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

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Left a group successfully"));

  // ------------------------------------------------------------
};
