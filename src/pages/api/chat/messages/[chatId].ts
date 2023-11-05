import { getAllMessages } from "@/socket/controllers/message-controllers/getAllMessages";
import { sendMessage } from "@/socket/controllers/message-controllers/sendMessage";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function hanler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    if (req.method === "GET") {
      await getAllMessages(req, res);
    } else if (req.method === "POST") {
      await sendMessage(req, res);
    } else {
      // throw error if the method is not allowed
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
