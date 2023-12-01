import { Prisma } from "@prisma/client";
import { ApiError } from "./ApiError";

export const errorResponse = (err: any) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // if not
    // create a new ApiError instance to keep the consistency

    const isClientError =
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientRustPanicError;

    // assign an appropriate status code
    const statusCode: number = error.statusCode || isClientError ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong!";
    // const message =
    //   process.env.NODE_ENV === "development"
    //     ? error.message || "Something went wrong!"
    //     : "Something went wrong!";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  return response;
};
