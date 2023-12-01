import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

export const getAllMessages = async (
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
    throw new ApiError(400, "Chat id is required");
  }

  const selectedChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    select: {
      participantIds: true,
    },
  });

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  // Only send messages if the logged in user is a part of the chat he is requesting messages of
  if (!selectedChat.participantIds.includes(tokenUser.id)) {
    throw new ApiError(400, "User is not a part of this chat");
  }

  const messages = await prisma.chatMessage.findMany({
    where: {
      chatId,
    },
    include: {
      sender: {
        select: {
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, messages || [], "Messages fetched successfully"),
    );
};
