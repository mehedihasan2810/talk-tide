import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

export const getAllChats = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }

  // retrieve all the chats that user created or joined
  const chats = await prisma.chat.findMany({
    where: {
      participantIds: {
        has: tokenUser.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
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
    .json(
      new ApiResponse(200, chats || [], "User chats fetched successfully!"),
    );
};
