import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

const createAGroupChat = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  // todo: remove the id
  if (!req.cookies.id) {
    req.cookies.id = "6544f41730a9d575de67d59d";
  }

  const { name, participantIds } = req.body;
  // Check if user is not sending himself as a participant. This will be done manually
  if (participantIds.includes(req.cookies.id)) {
    throw new ApiError(
      400,
      "Participants array should not contain the group creator"
    );
  }
  //   ------------------------------------------------------------

  // ---------------------------------------------------------------
  const members = Array.from(new Set([...participantIds, req.cookies.id])); // check for duplicates

  if (members.length < 3) {
    // check after removing the duplicate
    // We want group chat to have minimum 3 members including admin
    throw new ApiError(
      400,
      "Seems like you have passed duplicate participants."
    );
  }
  //   -------------------------------------------------------------

  // Create a group chat with provided members
  const groupChat = await prisma.chat.create({
    data: {
      name: name as string,
      isGroupChat: true,
      participantIds: members,
      adminId: req.cookies.id as string,
    },
  });
  // -------------------------------------------

  // structure the chat -----------------------
  const chat = await prisma.chat.findUnique({
    where: {
      id: groupChat.id,
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
    throw new ApiError(500, "Internal server error");
  }

  // ----------------------------------------------

  // logic to emit socket event about the new group chat added to the participants
  chat.participants.forEach((participant) => {
    if (participant.id === req.cookies.id) return; // don't emit the event for the logged in use as he is the one who is initiating the chat
    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      res.socket.server.io,
      participant.id,
      ChatEventEnum.NEW_CHAT_EVENT,
      chat
    );
  });
  // ------------------------------------------------------------------

  return res
    .status(201)
    .json(new ApiResponse(201, chat, "Group chat created successfully"));
  // ------------------------------------------------------------------
};

export { createAGroupChat };
