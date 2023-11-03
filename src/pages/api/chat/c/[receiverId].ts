import { createOrGetAOneOnOneChat } from "@/socket/controllers/chat-controllers/createOrGetAOneOnOneChat";
import { startSocketServer } from "@/socket/startSocketServer";
import { NextApiResponseServerIO } from "@/types/types";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    // start the socket server
    startSocketServer(req, res);

    // create or get oneOnOne chat
    await createOrGetAOneOnOneChat(req, res);
    // --------------------------------------
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
