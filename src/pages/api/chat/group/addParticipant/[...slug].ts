import { addNewParticipantInGroupChat } from "@/socket/controllers/chat-controllers/addNewParticipantInGroupChat";
import { removeParticipantFromGroupChat } from "@/socket/controllers/chat-controllers/removeParticipantFromGroupChat";
import { startSocketServer } from "@/socket/startSocketServer";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function hanler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    startSocketServer(req, res);

    if (req.method === "POST") {
      await addNewParticipantInGroupChat(req, res);
    } else if (req.method === "DELETE") {
      await removeParticipantFromGroupChat(req, res);
    } else {
      // throw error if the method is not allowed
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
