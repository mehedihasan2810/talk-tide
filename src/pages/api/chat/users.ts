import prisma from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types/types";
import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.cookies.id, // avoid logged in user
        },
      },

      select: {
        avatar: true,
        username: true,
        email: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    const errorRes = errorResponse(error);
    res.status(errorRes.statusCode).json(errorRes);
  }
}
