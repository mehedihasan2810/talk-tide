import prisma from "@/lib/prisma";
import { ChatEventEnum } from "@/socket/constants";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { getLocalPath } from "@/socket/helpers/getLocalPath";
import { getStaticFilePath } from "@/socket/helpers/getStaticFilePath";
import { handleFormData } from "@/socket/helpers/handleFormData";
import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

export const sendMessage = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }
  // ----------------------------------------------

  // get data from req
  const { chatId } = req.query as { chatId: string | undefined };
  // const { content, files } = req.body as {
  //   content: string | undefined;
  //   files: any;
  // };
  // ----------

  if (!chatId) {
    throw new ApiError(400, "ChatId is required");
  }

  const {
    fields: { content },
    files,
  } = await handleFormData(req);

  console.log(content, files);

  //   todo: fix the file later
  if (!content[0] && !files?.attachments?.length) {
    throw new ApiError(400, "Message content or attachment is required");
  }

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    select: {
      participantIds: true,
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messageFiles: { url: string; localPath: string }[] = [];

  if (files && files.attachments?.length > 0) {
    files.attachments?.map((attachment: any) => {
      messageFiles.push({
        url: getStaticFilePath(req, attachment.filename),
        localPath: getLocalPath(attachment.filename),
      });
    });
  }

  // Create a new message instance with appropriate metadata
  const message = await prisma.chatMessage.create({
    data: {
      senderId: tokenUser.id,
      content: content[0].trim(),
      chatId,
      attachments: messageFiles,
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
  });

  // logic to emit socket event about the new message created to the other participants
  chat.participantIds.forEach((participantId) => {
    // here the chat is the raw instance of the chat in which participants is the array of object ids of users
    // avoid emitting event to the user who is sending the message
    if (participantId === tokenUser.id) return;

    // emit the receive message event to the other participants with received message as the payload
    emitSocketEvent(
      res.socket.server.io,
      participantId,
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      message,
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message saved successfully"));
};
