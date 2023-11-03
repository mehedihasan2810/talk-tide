import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

const createOrGetAOneOnOneChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const { receiverId } = req.query as { receiverId: string | undefined };

  if (!receiverId || receiverId === undefined) {
    throw new ApiError(400, "Receiver id missing!");
  }

  // Check if it's a valid receiver
  const receiver = await prisma.user.findUnique({
    where: {
      id: receiverId,
    },
  });

  // ----------------------------------------

  // if not then throw error -------------------------
  if (!receiver) {
    throw new ApiError(404, "Receiver does not exist");
  }
  // --------------------------------------------------

  // check if receiver is not the user who is requesting a chat
  if (receiver.id === req.cookies.id) {
    throw new ApiError(400, "You cannot chat with yourself");
  }
  // ------------------------------------------------------------

  // -----------------------------------------------------------
  const chat = await prisma.chat.findMany({
    // -------------------------
    where: {
      isGroupChat: false, // avoid group chats. This controller is responsible for one on one chats

      // Also, filter chats with participants having receiver and logged in user only
      AND: [
        {
          participantIds: {
            has: req.cookies.id,
          },
        },
        {
          participantIds: {
            has: receiverId,
          },
        },
      ],
    },
    // ---------------------------------------------
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

  console.dir(chat, { depth: null });
  // -----------------------------------------------------------

  // -------------------------------------------------------------------
  if (chat.length) {
    // if we find the chat that means user already has created a chat
    type Chat = (typeof chat)[0];
    return res
      .status(200)
      .json(new ApiResponse<Chat>(200, chat[0], "Chat retrieved successfully"));
  }
  // ----------------------------------------------------------------------

  // if not we need to create a new one on one chat -----------------
  const newChatInstance = await prisma.chat.create({
    data: {
      name: "One on one chat",
      participantIds: [req.cookies.id as string, receiverId], // add receiver and logged in user as participants
      adminId: req.cookies.id as string,
    },
  });
  // ------------------------------------------------------------------

  // structure the chat as per the common aggregation to keep the consistency
  const createdChat = await prisma.chat.findUnique({
    where: {
      id: newChatInstance.id,
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
  // ------------------------------------------------------------

  // -----------------------------------------------
  if (!createdChat) {
    throw new ApiError(500, "Internal server error");
  }
  // ------------------------------------------------

  // logic to emit socket event about the new chat added to the participants
  createdChat.participants.forEach((participant) => {
    if (participant.id === req.cookies.id) return; // don't emit the event for the logged in use as he is the one who is initiating the chat

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.NEW_CHAT_EVENT,
      createdChat
    );
  });
  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  return res
    .status(201)
    .json(new ApiResponse(201, createdChat, "Chat retrieved successfully"));
  // ----------------------------------------------------------------------
};

export { createOrGetAOneOnOneChat };
