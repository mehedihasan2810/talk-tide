import { searchAvailableUsers } from "@/socket/controllers/chat-controllers/searchAvailableUsers";
import { NextApiResponseServerIO } from "@/types/types";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    await searchAvailableUsers(req, res);
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
