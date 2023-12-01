import { getAllMessages } from "@/socket/controllers/message-controllers/getAllMessages";
// import { sendMessage } from "@/socket/controllers/message-controllers/sendMessage";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  try {
    if (req.method === "GET") {
      // this `getAllMessages` function is responsible for retrieving all the
      // messages of a specific chat
      await getAllMessages(req, res);
    } else if (req.method === "POST") {
      // this `sendMessage` is responsible for saving the sent message to db and
      // emitting them to all the chat participant
      // await sendMessage(req, res);
    } else {
      // throw error if the method is not allowed
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
