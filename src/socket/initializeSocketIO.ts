import { ChatEventEnum } from "./constants";
// import cookie from "cookie";
import type { Server, Socket } from "socket.io";
import { mountJoinChatEvent } from "./socket-events/mountJoinChatEvent";
import { mountParticipantTypingEvent } from "./socket-events/mountParticipantTypingEvent";
import { mountParticipantStoppedTypingEvent } from "./socket-events/mountParticipantStoppedTypingEvent";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/types";

// todo
type NextApiRequestWithPayload = NextApiRequest & { user?: { id: string } };

const initializeSocketIO = (
  req: NextApiRequestWithPayload,
  res: NextApiResponseServerIO
) => {
  const io: Server = res.socket.server.io;
  return io.on(ChatEventEnum.CONNECTION_EVENT, async (socket: Socket) => {
    try {
      //   // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
      //   const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      //   //   ------------------------------------------------------------------

      //   //get the access token
      //   let token = cookies?.accessToken;
      //   // -----------------------------

      //   // ------------------------------------------
      //   if (!token) {
      //     // if there is no access token in cookies. Check inside the handshake auth
      //     token = socket.handshake.auth?.token;
      //   }
      //   //   ---------------------------------------------

      // if (!token) {
      //   // Token is required for the socket to work
      //   throw new ApiError(401, "Un-authorized handshake. Token is missing");
      // }

      // ------------------------------------------
      socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
      console.log("User connected 🗼");
      // ------------------------------------------

      // Common events that needs to be mounted on the initialization
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);
      // -------------------------------------------------

      // DISCONNECTED EVENT -----------------------------
      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: ");
        // if (socket.user?._id) {
        //   socket.leave(socket.user._id);
        // }
      });
      // -------------------------------------------------
    } catch (error: unknown) {
      // SOCKET ERROR EVENT ---------------------
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        (error as Error).message ||
          "Something went wrong while connecting to the socket."
      );
      // ----------------------------------------
    }
  });
};

export { initializeSocketIO };
