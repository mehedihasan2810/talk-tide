import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/types";
import { startSocketServer } from "@/socket/startSocketServer";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  try {

    // start the socket server if any request hits this endpoint
    startSocketServer(req, res);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Socket connected successfully"));
  } catch (error: any) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
