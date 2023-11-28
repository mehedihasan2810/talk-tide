import prisma from "@/lib/prisma";
import { validateUserCredentials } from "@/utils/validators/validateUserCredentials";
import { LoginUserReturn as RegisterUserReturn } from "./loginUser";
import { hashPassword } from "./password";

interface Params {
  authType: string;
  username: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  authType,
  username,
  email,
  password,
}: Params): Promise<RegisterUserReturn> => {
  // validate the incoming user credentials-----------------------
  validateUserCredentials({ authType, username, email, password });
  // --------------------------------------------------------------

  // check if email exists -----------------------------
  const emailCredential = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  // if email exists then throw error as the user
  // with the email is already logged in
  if (emailCredential) {
    throw new Error(
      `User already exists with this email ${emailCredential.email}`,
    );
  }
  // --------------------------------------------------------------

  // now check if the username exists
  const usernameCredential = await prisma.user.findUnique({
    where: {
      username: username.trim(),
    },
    select: {
      username: true,
    },
  });

  // if username already exists in our db the throw error as
  // username should be unique per user
  if (usernameCredential) {
    throw new Error(
      `User already exists with this username ${usernameCredential.username}. Select a unique username`,
    );
  }
  // -------------------------------------------------------------

  // hash password in order to save it in the db
  const hashedPassword = await hashPassword(password);
  // -------------------------------------------------

  // if there is no hurdles then register the user
  const createdUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      avatar: {},
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  // and then return the created user credentials
  // so that next auth can use them as session data
  // in client side
  return {
    id: createdUser.id,
    name: createdUser.username,
    email: createdUser.email,
    role: createdUser.role,
  };
};
