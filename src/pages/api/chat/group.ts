import { createAGroupChat } from "@/socket/controllers/chat-controllers/createAGroupChat";
import { startSocketServer } from "@/socket/startSocketServer";
import { createAGroupChatValidator } from "@/socket/validators/createAGroupChatValidator";
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
      // validate request body
      createAGroupChatValidator(req.body);

      // start socket server
      startSocketServer(req, res);

      // this `createAGroupChat` handler is responsible for creating a group chat
      await createAGroupChat(req, res);
      // ------------------------------
    } else {
      // throw error if the method is not allowed
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
