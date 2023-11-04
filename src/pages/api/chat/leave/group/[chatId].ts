import { leaveGroupChat } from "@/socket/controllers/chat-controllers/leaveGroupChat";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    if (req.method === "DELETE") {
      await leaveGroupChat(req, res);
    } else {
      // throw error if the method is not allowed
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
