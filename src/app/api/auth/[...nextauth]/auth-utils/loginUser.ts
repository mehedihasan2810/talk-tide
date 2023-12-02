import prisma from "@/lib/prisma";

import { validateUserCredentials } from "@/utils/validators/validateUserCredentials";
import { verifyPassword } from "./password";

interface Params {
  authType: string;
  username: string;
  password: string;
}

export interface LoginUserReturn {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const loginUser = async ({
  authType,
  username,
  password,
}: Params): Promise<LoginUserReturn> => {
  // validate the incoming user credentials---------------
  validateUserCredentials({ authType, username, password });

  // check if the user is logged in with the provided
  // username
  const loggedInUser = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
    },
  });

  // if not then throw error
  if (!loggedInUser) {
    throw new Error(
      `Wrong username! No user found with this ${username} username`,
    );
  }

  // if the user exists with the username then
  // validate the existing password with the provided
  // password
  const isValidPassword = await verifyPassword(password, loggedInUser.password);

  if (!isValidPassword) {
    throw new Error("Wrong Password!");
  }

  // if everything ok then user is a logged in user
  // send the credentials
  return {
    id: loggedInUser.id,
    name: loggedInUser.username,
    email: loggedInUser.email,
    role: loggedInUser.role,
  };
};
