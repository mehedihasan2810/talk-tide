import prisma from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { NextApiRequest } from "next";
import { deleteCascadeChatMessages } from "./deleteCascadeChatMessages";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { ChatEventEnum } from "@/socket/constants";
import { ApiResponse } from "@/utils/helpers/apiResponse";

export const deleteOneOnOneChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const { chatId } = req.query as { chatId: string | undefined };

  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "Chat id is missing");
  }

  //  check for chat existence --------------
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
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
  // ------------------------------------------

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }

  // delete the chat even if user is not admin because it's a personal chat
  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
  // ----------------------------

  await deleteCascadeChatMessages(chatId); // delete all the messages and attachments associated with the chat

  chat.participants.forEach((participant) => {
    // no need for logged in user to be notified
    if (participant.id === req.cookies.id) return;

    // emit event to other participant with left chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.LEAVE_CHAT_EVENT,
      chat
    );
    // --------------------------------
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
};
