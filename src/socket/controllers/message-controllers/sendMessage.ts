// import prisma from "@/lib/prisma";
// import { ChatEventEnum } from "@/socket/constants";
// import { getUserFromToken } from "@/socket/getUserFromToken";
// // import { handleFormData } from "@/socket/helpers/handleFormData";
// import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
// import { NextApiResponseServerIO } from "@/types/session";
// import { ApiError } from "@/utils/error-helpers/ApiError";
// import { ApiResponse } from "@/utils/helpers/apiResponse";
// import fs from "fs";
// import { NextApiRequest } from "next";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const sendMessage = async (
//   req: NextApiRequest,
//   res: NextApiResponseServerIO,
// ) => {
//   // get user from auth token
//   const tokenUser = await getUserFromToken(req);

//   // if there is no user throw error
//   if (!tokenUser) {
//     throw new ApiError(401, "Unauthorized request!");
//   }
//   // ----------------------------------------------

//   // get data from req query
//   const { chatId } = req.query as { chatId: string | undefined };

//   if (!chatId) {
//     throw new ApiError(400, "ChatId is required");
//   }

//   // this `handleFormData` function is responsible for extracting formdata
//   // from the req with the help of formidable and then validating the data
//   // if validation fails then throws error otherwise returns the extracted
//   // form data
//   // const { content, attachments } = await handleFormData(req);

//   // iterate over the `attachments` and create an array of promises of image
//   // upload request to cloudinary
//   const imageUploadRequests = attachments.map((file) => {
//     // get the raw buffer
//     var rawData = fs.readFileSync(file.filepath);

//     // transform it to `Uint8Array` buffer
//     const buffer = new Uint8Array(rawData);

//     // create the promise of upload request and return it
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             tags: ["talk-tide-images"],
//           },
//           function (error, result) {
//             if (error) {
//               reject(error);
//               return;
//             }
//             resolve({ url: result?.secure_url, localPath: "" });
//           },
//         )
//         .end(buffer);
//     });
//   });
//   // ------------------------------------------

//   // pass the imageUploadRequests to `Promise.all` api in order that they resolves parallelly
//   const imageUploadResults = (await Promise.all(imageUploadRequests)) as {
//     url: string;
//     localPath: string;
//   }[];

//   // Create a new message instance with appropriate metadata
//   const message = await prisma.chatMessage.create({
//     data: {
//       senderId: tokenUser.id,
//       content: content,
//       chatId,
//       attachments: imageUploadResults,
//     },
//     include: {
//       sender: {
//         select: {
//           username: true,
//           avatar: true,
//           email: true,
//         },
//       },
//       chat: {
//         select: {
//           participantIds: true,
//         },
//       },
//     },
//   });

//   // logic to emit socket event about the new message created to the other participants
//   message.chat.participantIds.forEach((participantId) => {
//     // here the chat is the raw instance of the chat in which participants is the array of object ids of users
//     // avoid emitting event to the user who is sending the message
//     if (participantId === tokenUser.id) return;

//     // emit the receive message event to the other participants with received message as the payload
//     emitSocketEvent(
//       res.socket.server.io,
//       participantId,
//       ChatEventEnum.MESSAGE_RECEIVED_EVENT,
//       message,
//     );
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, message, "Message saved successfully"));
// };
