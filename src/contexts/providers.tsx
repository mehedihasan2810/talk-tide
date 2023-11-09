"use client";

import { ReactNode } from "react";
import SessionContext from "./SessionContext";
import { SocketProvider } from "./SocketContext";

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionContext>
      <SocketProvider>{children}</SocketProvider>
    </SessionContext>
  );
};

export default Provider;
