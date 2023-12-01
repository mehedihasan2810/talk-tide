import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";
import { deleteCascadeChatMessages } from "./deleteCascadeChatMessages";
import { getUserFromToken } from "@/socket/getUserFromToken";

const deleteGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }

  const { chatId } = req.query as { chatId: string | undefined };

  // throw error if theres no chat id
  if (!chatId || chatId === undefined) {
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
  if (groupChat.adminId !== tokenUser.id) {
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
  deletedChat.participants.forEach((participant) => {
    if (participant.id === tokenUser.id) return; // don't emit the event for the logged in use as he is the one who is deleting
    // emit event to other participants with left chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.LEAVE_CHAT_EVENT,
      deletedChat,
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
};

export { deleteGroupChat };
