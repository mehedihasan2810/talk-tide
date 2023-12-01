import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { ApiError } from "@/utils/error-helpers/ApiError";
import prisma from "@/lib/prisma";
import { SessionUser } from "@/types/session";
import { ApiResponse } from "@/utils/helpers/apiResponse";

interface Session {
  user: SessionUser;
}

export async function GET() {
  try {
    // get user from auth token
    //   const tokenUser = await getUserFromToken(req);
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    // retrieve all the users instead logged in user
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: session.user.id, // avoid logged in user
        },
      },

      select: {
        id: true,
        avatar: true,
        username: true,
        email: true,
      },
    });
    return NextResponse.json(
      new ApiResponse(200, users, "Users fetched successfully"),
      { status: 200 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
