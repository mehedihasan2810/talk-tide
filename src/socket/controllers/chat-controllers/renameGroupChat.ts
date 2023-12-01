import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

const renameGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }

  const { chatId } = req.query;
  const { name } = req.body;

  // throw error if theres no chat id
  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "chat id is missing!");
  }

  // throw error if theres no name
  if (!name || name === undefined) {
    throw new ApiError(400, "group name is missing!");
  }

  // check for chat existence
  const groupChat = await prisma.chat.findUnique({
    where: {
      id: chatId as string,
      isGroupChat: true,
    },
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // only admin can change the name
  if (groupChat.adminId !== tokenUser.id) {
    throw new ApiError(404, "You are not an admin");
  }

  //   update the group name and retrieve necessary data
  const updateGroupChat = await prisma.chat.update({
    where: {
      id: chatId as string,
    },
    data: {
      name,
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

  // logic to emit socket event about the updated chat name to the participants
  updateGroupChat.participants.forEach((participant) => {
    // emit event to all the participants with updated chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
      updateGroupChat,
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateGroupChat,
        "Group chat name updated successfully",
      ),
    );
};

export default renameGroupChat;
