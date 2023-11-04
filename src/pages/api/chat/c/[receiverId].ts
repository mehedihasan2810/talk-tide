import { createOrGetAOneOnOneChat } from "@/socket/controllers/chat-controllers/createOrGetAOneOnOneChat";
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
    if (req.method === "POST") {
      // start the socket server
      startSocketServer(req, res);

      // create or get oneOnOne chat
      await createOrGetAOneOnOneChat(req, res);
    } else {
      throw new ApiError(405, "Method not allowed");
    }

    // --------------------------------------
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
