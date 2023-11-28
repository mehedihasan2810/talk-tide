import { deleteGroupChat } from "@/socket/controllers/chat-controllers/deleteGroupChat";
import { getGroupChatDetails } from "@/socket/controllers/chat-controllers/getGroupChatDetails";
import renameGroupChat from "@/socket/controllers/chat-controllers/renameGroupChat";
import { startSocketServer } from "@/socket/startSocketServer";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    // start socket server
    startSocketServer(req, res);

    // --------------------------------

    if (req.method === "GET") {
      await getGroupChatDetails(req, res);
    }

    // ---------------------------------

    if (req.method === "PATCH") {
      await renameGroupChat(req, res);
    }

    // ----------------------------------

    if (req.method === "DELETE") {
      await deleteGroupChat(req, res);
    }

    // throw error if the method is not allowed
    throw new ApiError(405, "Method not allowed");

    //  ---------------------------------
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
