import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/types";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { initializeSocketIO } from "@/socket/initializeSocketIO";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "http://localhost:4000",
      },
    });

    initializeSocketIO(io)

    res.socket.server.io = io;

    // io.on("connection", (socket) => {
    //   console.log("connectionnnnn")
    //   socket.broadcast.emit("a user connected");
    //   socket.on("hello", (msg) => {
    //     console.log(msg);
    //     socket.emit("hello", "world!");
    //   });
    // });
  } else {
    console.log("socket already running");
  }

  res.end();
}
