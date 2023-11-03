import { createAGroupChat } from "@/socket/controllers/chat-controllers/createAGroupChat";
import { startSocketServer } from "@/socket/startSocketServer";
import { createAGroupChatValidator } from "@/socket/validators/createAGroupChatValidator";
import { NextApiResponseServerIO } from "@/types/types";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    // validate request body
    createAGroupChatValidator(req.body);

    // start socket server
    startSocketServer(req, res);

    // create group chat ------------
    await createAGroupChat(req, res);
    // ------------------------------
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}