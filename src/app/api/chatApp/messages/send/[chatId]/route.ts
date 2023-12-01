import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
// import { getUserFromToken } from "@/socket/getUserFromToken";
import { ApiError } from "@/utils/error-helpers/ApiError";
// import { zfd } from "zod-form-data";
// import { z } from "zod";
import { ApiResponse } from "@/utils/helpers/apiResponse";
// import { handleFormData } from "@/socket/helpers/handleFormData";
import prisma from "@/lib/prisma";
// import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { SessionUser } from "@/types/session";
import { pusherServer } from "@/lib/pusher";
// import { emitSocketEvent } from "@/socket/socket-events/emitSocketEvent";
import { ChatEventEnum } from "@/socket/constants";
// import { z } from "zod";
// import { File } from "buffer";
// import fs from "fs";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface Session {
  user: SessionUser;
}

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "8mb",
//     },
//   },
// };


export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    // if there is no user throw error
    if (!session) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const chatId = params.chatId;

    if (!chatId) {
      throw new ApiError(400, "Chat id is required");
    }



    const {content, image} = await req.json();
   



    


/*

    const formData = await req.formData();

    // form schema
    const formSchema = z.object({
      content: z.string(),
      attachments: z
        .instanceof(File, { message: "attachment is not valid file" })
        .array(),
    });

    // validate the form data
    const fordResult = formSchema.safeParse({
      content: formData.get("content") || "",
      attachments: formData.getAll("attachments"),
    });

    // if validation fails then throw error
    if (!fordResult.success) {
      const extractedErrors = fordResult.error.issues.map(
        (err: (typeof fordResult.error.issues)[0]) => {
          const path = err.path[0];
          return `${[path]}: ${err.message}`;
        },
      );

      // throw the error along with the validation error
      throw new ApiError(422, extractedErrors.join(", "));
      // -----
    }

    // if validation completes successfully then extract the data
    const { content, attachments } = fordResult.data;

    const f = attachments[0];
    console.log(f.name);

    let writeStream = fs.createWriteStream(`/tmp/${f.name}`);
    writeStream.write(new Uint8Array(await attachments[0].arrayBuffer()));

    writeStream.on("finish", function () {
      const fileContent = fs.readFileSync(`/tmp/${f.name}`);
      console.log(fileContent);
    });

    // iterate over the `attachments` and create an array of promises of image
    // upload request to cloudinary
    // const imageUploadRequests = attachments.map(async (file) => {
    // const arrayBuffer = await file.arrayBuffer();
    const arrayBuffer = await attachments[0].arrayBuffer();

    // transform it to `Uint8Array` buffer
    const buffer = new Uint8Array(arrayBuffer);
    // create the promise of upload request and return it

    */


    const imageParts = image.split(",")[1];

    console.log(imageParts)

    const buffer = Buffer.from(imageParts, "base64")

    const imageUploadResults = await new Promise((resolve, reject) => {
      // const imageUploadResults: any = [];

      cloudinary.uploader
        .upload_stream(
          {
            tags: ["talk-tide-images"],
            resource_type: "image",
          },
          function (error, result) {
            if (error) {
              reject(error);
              throw new ApiError(500, error.message);
              // return;
            }

            resolve([{ url: result?.secure_url, localPath: "" }]);
            console.log("hey");
            // imageUploadResults.push({ url: result?.secure_url, localPath: "" });
          },
        )
        .end(buffer);
    });
    // });

    // pass the imageUploadRequests to `Promise.all` api in order that they resolves parallelly
    // const imageUploadResults = (await Promise.all(imageUploadRequests)) as {
    //   url: string;
    //   localPath: string;
    // }[];

    console.log(imageUploadResults);

    // Create a new message instance with appropriate metadata
    const message = await prisma.chatMessage.create({
      data: {
        senderId: session.user.id,
        content: content,
        // content: "",
        chatId,
        attachments: imageUploadResults as {
          url: string;
          localPath: string;
        }[],
        // attachments: [],
      },
      include: {
        sender: {
          select: {
            username: true,
            avatar: true,
            email: true,
          },
        },
        chat: {
          select: {
            participantIds: true,
          },
        },
      },
    });

    

    // logic to emit event about the new message created to the other participants
    for (const participantId of message.chat.participantIds) {
      // ignore the sender
      if (participantId === session.user.id) continue;
      // -------

      await pusherServer.trigger(
        participantId,
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        message,
      );
    }

    

    return NextResponse.json(
      new ApiResponse(201, "message", "Message saved successfully"),
      { status: 201 },
    );
  } catch (error) {
    const errorRes = errorResponse(error);
    return NextResponse.json(errorRes, { status: errorRes.statusCode });
  }
}
