import { ApiError } from "@/utils/error-helpers/ApiError";
import { z } from "zod";

const createAGroupChatValidator = (data: Record<string, unknown>) => {
  //schema defs
  const schema = z.object({
    name: z
      .string({
        required_error: "Group name is required",
        invalid_type_error: "name must be string",
      })
      .trim(),
    participantIds: z
      .string()
      .array()
      .min(2, {
        message:
          "ParticipantIds must be an array with more than or equal to 2 members and less than or equal to 50 members",
      })
      .max(50, {
        message:
          "ParticipantIds must be an array with more than or equal to 2 members and less than or equal to 50 members",
      }),
  });
  //   ---------------------------------------------------------------------

  const result = schema.safeParse(data);

  if (!result.success) {
    const extractedErrors = result.error.issues.map(
      (err: (typeof result.error.issues)[0]) => {
        const path = err.path[0];
        return { [path]: err.message };
      },
    );

    // 422: Unprocessable Entity
    throw new ApiError(422, "Received data is not valid", extractedErrors);
    // ------------------------------------------
  }
};

export { createAGroupChatValidator };
