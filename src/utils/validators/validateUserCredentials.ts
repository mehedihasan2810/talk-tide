import { LoginSchema } from "../zod-schema/loginSchema";
import { RegisterSchema } from "../zod-schema/registerSchema";

interface Params {
  authType: string;
  username: string;
  email?: string;
  password: string;
}

export const validateUserCredentials = (data: Params) => {
  const result = (
    data.authType === "register" ? RegisterSchema : LoginSchema
  ).safeParse(data);

  if (!result.success) {
    const extractedErrors = result.error.issues.map(
      (err: (typeof result.error.issues)[0]) => {
        return err.message;
      },
    );

    throw new Error(extractedErrors.join(","));
    // ------------------------------------------
  }
};
