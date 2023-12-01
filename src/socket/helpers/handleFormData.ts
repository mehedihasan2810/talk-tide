// import { NextApiRequest } from "next";
// import formidable, { File } from "formidable";
// import { z } from "zod";
// import { ApiError } from "@/utils/error-helpers/ApiError";

// const fileSchema = z.object({
//   size: z.number(),
//   filepath: z.string(),
//   originalFilename: z.string().nullable(),
//   newFilename: z.string(),
//   mimetype: z.string().nullable(),
//   mtime: z.union([z.date(), z.undefined()]).optional().nullable(),
//   hashAlgorithm: z.union([
//     z.literal(false),
//     z.literal("sha1"),
//     z.literal("md5"),
//     z.literal("sha256"),
//   ]),
//   hash: z.string().optional().nullable(),
// });

// // --------------------------------

// const validateFromData = async ({
//   content,
//   attachments,
// }: {
//   content: string;
//   attachments: File[];
// }) => {
//   // schema for formdata
//   const schema = z.object({
//     content: z.string().trim(),
//     attachments: fileSchema.optional().array(),
//   });

//   // validate incoming form data
//   const result = schema.safeParse({ content, attachments });

//   // throw error if the validation fails
//   if (!result.success) {
//     const extractedErrors = result.error.issues.map(
//       (err: (typeof result.error.issues)[0]) => {
//         const path = err.path[0];
//         return { [path]: err.message };
//       },
//     );

//     // throw the error along with the validation error
//     throw new ApiError(422, "Received data is not valid", extractedErrors);
//     // -----
//   }
// };

// // ---------------------------------------------------------

// type HandleFormData = (_req: NextApiRequest) => Promise<{
//   content: string;
//   attachments: File[];
// }>;

// export const handleFormData: HandleFormData = async (req) => {
//   const form = formidable({ multiples: true });

//   // extract the form data with the help of formidable
//   const formData = new Promise((resolve, reject) => {
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         reject(new ApiError(500, "Unable to process form data. Try again"));
//       }
//       resolve({ fields, files });
//     });
//   });

//   // destructure the extracted form data
//   const { fields, files } = (await formData) as {
//     fields: { content?: string[] };
//     files: { attachments?: File[] };
//   };

//   /* The `if` statement is checking if both `content` and `files.attachments` are falsy values. If both
// are falsy, it means that neither a message nor an attachment was provided in the form data. In this
// case, it throws an `ApiError` with a status code of 400 (Bad Request) and a message indicating that
// either a message or an attachment is required. */
//   const content = fields.content && fields.content[0];
//   if (!content && !files?.attachments?.length) {
//     throw new ApiError(400, "Either message or attachment required");
//   }
//   // ----------------------------------------------------------------

//   // if there is no content provided then assign empty string otherwise
//   // keep it as it is
//   // if there is no attachments provided then assign empty array otherwise
//   // keep it as it is
//   const formInfo = {
//     content: fields.content ? fields.content[0] : "",
//     attachments: files.attachments ? files.attachments : [],
//   };

//   //  this function is responsible for
//   // validating the incoming form data
//   await validateFromData(formInfo);

//   // if the validation successful the return the data
//   return formInfo;
// };
