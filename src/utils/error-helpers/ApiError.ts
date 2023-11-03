class ApiError extends Error {
  statusCode: number;
  message: string;
  errors: (Record<string, string> | string)[];
  success: boolean;
  data: any | null;
  stack?: string | undefined;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: (Record<string, string> | string)[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
