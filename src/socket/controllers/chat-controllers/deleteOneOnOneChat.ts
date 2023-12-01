import prisma from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { NextApiRequest } from "next";
import { deleteCascadeChatMessages } from "./deleteCascadeChatMessages";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { ChatEventEnum } from "@/socket/constants";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { getUserFromToken } from "@/socket/getUserFromToken";

export const deleteOneOnOneChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }
  // -------------------------------------------

  const { chatId } = req.query as { chatId: string | undefined };

  //  chat id is required to proceed
  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "Chat id is missing");
  }

  await deleteCascadeChatMessages(chatId); // first delete all the messages and attachments associated with the chat

  // delete the chat even if user is not admin because it's a personal chat
  const chat = await prisma.chat.delete({
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
  // ----------------------------

  chat.participants.forEach((participant) => {
    // no need for logged in user to be notified
    if (participant.id === tokenUser.id) return;

    // emit event to other participant with left chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.LEAVE_CHAT_EVENT,
      chat,
    );
    // --------------------------------
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
};
