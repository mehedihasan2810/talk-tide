import prisma from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

const getGroupChatDetails = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const { chatId } = req.query;
  console.log(chatId);

  // throw error if theres no chat id ------------
  if (!chatId || chatId === undefined) {
    throw new ApiError(400, "chat id is missing!");
  }
  // ---------------------------------------------

  // find the chat -----------------------
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId as string,
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
  //   -------------------------------------------

  if (!chat) {
    throw new ApiError(404, "Group chat does not exist!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, chat, "Group chat fetched successfully"));
};

export { getGroupChatDetails };
