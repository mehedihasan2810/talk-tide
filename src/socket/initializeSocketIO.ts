import { ChatEventEnum } from "./constants";
import type { Server, Socket } from "socket.io";
import { mountJoinChatEvent } from "./socket-events/mountJoinChatEvent";
import { mountParticipantTypingEvent } from "./socket-events/mountParticipantTypingEvent";
import { mountParticipantStoppedTypingEvent } from "./socket-events/mountParticipantStoppedTypingEvent";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/session";
import { ApiError } from "@/utils/error-helpers/ApiError";
import prisma from "@/lib/prisma";

type NextApiRequestWithPayload = NextApiRequest & { user?: { id: string } };

type SocketType = Socket & {
  user?: {
    id: string;
    password: string;
    refreshToken: string | null;
    emailVerificationToken: string | null;
    emailVerificationExpiry: Date | null;
  };
};

const initializeSocketIO = (
  _req: NextApiRequestWithPayload,
  res: NextApiResponseServerIO,
) => {
  const io: Server = res.socket.server.io;
  return io.on(ChatEventEnum.CONNECTION_EVENT, async (socket: SocketType) => {
    try {
      const credentials = socket.handshake.auth.user;

      if (!credentials) {
        // credentials are required for the socket to work
        throw new ApiError(401, "Un-authorized handshake. Invalid credentials");
      }

      // retrieve the user
      const user = await prisma.user.findUnique({
        where: {
          id: credentials.id,
        },
        select: {
          id: true,
          password: true,
          refreshToken: true,
          emailVerificationToken: true,
          emailVerificationExpiry: true,
        },
      });

      if (!user) {
        throw new ApiError(401, "Un-authorized handshake. Invalid Credentials");
      }

      socket.user = user; // mount te user object to the socket

      // We are creating a room with user id so that if user is joined but does not have any active chat going on.
      // still we want to emit some socket events to the user.
      // so that the client can catch the event and show the notifications.
      socket.join(user.id);

      socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
      console.log("User connected 🗼. userId: ", user.id);

      // Common events that needs to be mounted on the initialization
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);
      // -------------------------------------------------

      // DISCONNECTED EVENT -----------------------------
      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: ");
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
      // -------------------------------------------------
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        (error as Error).message ||
          "Something went wrong while connecting to the socket.",
      );
    }
  });
};

export { initializeSocketIO };
