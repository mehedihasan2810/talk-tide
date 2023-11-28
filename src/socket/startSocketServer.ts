import { initializeSocketIO } from "./initializeSocketIO";
import { NextApiResponseServerIO } from "@/types/types";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import chalk from "chalk";
import { NextApiRequest } from "next";
import { ApiError } from "@/utils/error-helpers/ApiError";

export const startSocketServer = (
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) => {
  try {
    //   if there is no server running
    if (!res.socket.server.io) {
      console.log("Initializing socket server...");

      const httpServer: NetServer = res.socket.server as any;

      // then create one otherwise don't
      const io = new ServerIO(httpServer, {
        pingTimeout: 60000,
        cors: {
          origin: process.env.CORS_ORIGIN as string,
          credentials: true,
        },
      });

      res.socket.server.io = io; // assign the server to res

      initializeSocketIO(req, res); // handle the connection event and others
    } else {
      console.log("Socket server already running");
    }
  } catch (error) {
    console.log(
      `startSocketServer: ${chalk.bold.red((error as Error).message)}`,
    );
    throw new ApiError(500, "Internal server error");
  }
};
