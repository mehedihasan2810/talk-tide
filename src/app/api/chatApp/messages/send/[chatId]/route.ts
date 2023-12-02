import { errorResponse } from "@/utils/error-helpers/errorResponse";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/utils/error-helpers/ApiError";
import { ApiResponse } from "@/utils/helpers/apiResponse";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { SessionUser } from "@/types/session";
import { pusherServer } from "@/lib/pusher";
import { ChatEventEnum } from "@/utils/constants";
import { z } from "zod";
import { File } from "buffer";
import mime from "mime";

interface Session {
  user: SessionUser;
}

const IMG_HOSTING_URL = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;

const imgbbSupportedImg: Readonly<string[]> = [
  "jpg",
  "jpeg",
  "png",
  "bmp",
  "gif",
  "tiff",
  "webp",
  "heic",
  "pdf",
];

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

    // make a list of image upload request
    const imgUploadRequests = attachments.map((file) => {
      const ext = mime.getExtension(file.type) as string;

      if (!imgbbSupportedImg.includes(ext.toLocaleLowerCase())) {
        throw new ApiError(
          400,
          `Image file is not supported. Supported images with extensions are jpg, png, bmp, gif, tiff, webp, heic, pdf`,
        );
      }

      const imgFormData = new FormData();
      imgFormData.append("image", file as Blob);

      return fetch(IMG_HOSTING_URL, {
        method: "POST",
        body: imgFormData,
      });
    });

    // resolve the requests parallely
    const imgUploadResponses = await Promise.all(imgUploadRequests);

    // now resolve the responses parallely as well
    const imgUploadedResult = await Promise.all(
      imgUploadResponses.map((res) => res.json()),
    );

    // extract our necessary field from the response
    const fileAttachments = imgUploadedResult.map((imgResult) => {
      if (!imgResult.success)
        throw new ApiError(
          500,
          "Something went wrong while uploading image! Try again",
        );

      return {
        url: imgResult.data.display_url,
        localPath: "",
      };
    }) as {
      url: string;
      localPath: string;
    }[];

    // Create a new message instance with appropriate metadata
    const message = await prisma.chatMessage.create({
      data: {
        senderId: session.user.id,
        content: content,
        chatId,
        attachments: fileAttachments,
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
