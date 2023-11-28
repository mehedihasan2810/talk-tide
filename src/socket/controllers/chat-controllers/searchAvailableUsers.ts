import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/socket/getUserFromToken";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

const searchAvailableUsers = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  // get user from auth token
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    throw new ApiError(401, "Unauthorized request!");
  }

  // retrieve all the users instead logged in user
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: tokenUser.id, // avoid logged in user
      },
    },

    select: {
      id: true,
      avatar: true,
      username: true,
      email: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
};

export { searchAvailableUsers };
