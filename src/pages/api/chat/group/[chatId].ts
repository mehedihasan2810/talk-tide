import { getGroupChatDetails } from "@/socket/controllers/chat-controllers/getGroupChatDetails";
import { NextApiResponseServerIO } from "@/types/types";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    // start socket server
    // startSocketServer(req, res);

    // --------------------------------
    await getGroupChatDetails(req, res);
    // ---------------------------------
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
