import { type NextApiRequest } from "next";
import { DefaultJWT, getToken } from "next-auth/jwt";

type TokenUser = DefaultJWT & {
  id: string;
  role: string;
};

export const getUserFromToken = async (
  req: NextApiRequest,
): Promise<TokenUser | null> => {
  // get the user from auth token
  const user = await getToken({ req });

  return user as TokenUser | null;
};
