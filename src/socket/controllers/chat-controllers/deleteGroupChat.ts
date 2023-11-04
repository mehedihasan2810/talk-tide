import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";
import { deleteCascadeChatMessages } from "./deleteCascadeChatMessages";

const deleteGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const { chatId } = req.query as { chatId: string | undefined };

  // throw error if theres no chat id ------------
  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "chat id is missing!");
  }
  // ---------------------------------------------

  // check for the group chat existence ---------------
  const groupChat = await prisma.chat.findUnique({
    where: {
      id: chatId as string,
      isGroupChat: true,
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

  //   ----------------------------------------------------

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // check if the user who is deleting is the group admin
  if (groupChat.adminId !== req.cookies.id) {
    throw new ApiError(404, "Only admin can delete the group");
  }

  // delete the chat ----------
  await prisma.chat.delete({
    where: {
      id: chatId as string,
    },
  });
  //   ------------------------

  await deleteCascadeChatMessages(chatId); // remove all messages and attachments associated with the chat

  // logic to emit socket event about the group chat deleted to the participants
  groupChat.participants.forEach((participant) => {
    if (participant.id === req.cookies.id) return; // don't emit the event for the logged in use as he is the one who is deleting
    // emit event to other participants with left chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.LEAVE_CHAT_EVENT,
      groupChat
    );
  });
  //   --------------------------------------------------------------------

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group chat deleted successfully"));

  // -----------------------------------------------------------------------
};

export { deleteGroupChat };
