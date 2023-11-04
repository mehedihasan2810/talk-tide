import prisma from "@/lib/prisma";
import { NextApiResponseServerIO } from "@/types/types";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import { NextApiRequest } from "next";

const searchAvailableUsers = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
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
};

export { searchAvailableUsers };
