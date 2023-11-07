import { RegisterSchema } from "./registerSchema";

export const LoginSchema = RegisterSchema.omit({ email: true });
