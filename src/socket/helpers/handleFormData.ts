import { NextApiRequest } from "next";
import formidable from "formidable";
import { z } from "zod";
import { ApiError } from "@/utils/error-helpers/ApiError";

// async function saveFormData(fields, files) {
//   // save to persistent data store
// }

const validateFromData = async (fields: { content: string }, files: any) => {
  const schema = z.object({
    content: z
      .string({
        required_error: "Content is required",
        invalid_type_error: "Content must be string",
      })
      .trim()
      .array()
      .nonempty(),
    attachments: z.any(),
  });

  const result = schema.safeParse({ ...fields, ...files });

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

export const handleFormData = async (req: NextApiRequest) => {
  const form = formidable({ multiples: true });

  const formData = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject("error");
      }
      resolve({ fields, files });
    });
  });

  const { fields, files } = (await formData) as any;

  await validateFromData(fields, files);

  //   await saveFormData(fields, files);

  return { fields, files };
};
