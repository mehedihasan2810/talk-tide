import { getAllChats } from "@/socket/controllers/chat-controllers/getAllChats";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function hanler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  try {
    if (req.method === "GET") {
      // this `getAllChats` function is responsible for retrieving all the chats
      await getAllChats(req, res);
    } else {
      // throw error if the method is not allowed
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
