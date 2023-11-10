import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { DefaultSession } from "next-auth";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

type DefaultSessionUser = NonNullable<DefaultSession["user"]>;

export type SessionUser = DefaultSessionUser & {
  id: string;
  role: string;
};

export type Session = DefaultSession & {
  user?: SessionUser;
};
