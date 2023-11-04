import prisma from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

export const leaveGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const { chatId } = req.query as { chatId: string | undefined };

  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "chat id is missing");
  }

  //  check if chat is a group chat -------------
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

  // todo: fix cookie credential later
  // check if the participant that is leaving the group, is part of the group
  if (!groupChat.participantIds.includes(req.cookies.id as string)) {
    throw new ApiError(400, "You are not a part of this group chat");
  }

  //   leave the chat --------------------------------------------
  const updatedParticipantIds = groupChat.participantIds.filter(
    (id) => id !== req.cookies.id
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
    select: {
      id: true,
    },
  });

  // --------------------------------------------------------------

  const chat = await prisma.chat.findUnique({
    where: {
      id: updatedChat.id,
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

  //   --------------------------------------------

  if (!chat) {
    throw new ApiError(500, "Internal server error");
  }

  //   ------------------------------------------------

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Left a group successfully"));

  // ------------------------------------------------------------
};
