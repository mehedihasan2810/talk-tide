import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { requestHandler } from "@/utils/requestHandler";
import { useSession } from "next-auth/react";

// Create a context to hold the socket instance
const SocketContext = createContext<{
  socket: Socket | null;
}>({
  socket: null,
});

// Custom hook to access the socket instance from the context
const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState<Socket | null>(null);

  const { data: session, status } = useSession();

  const { data } = useQuery({
    queryKey: ["socket"],
    queryFn: requestHandler<null>(() => apiClient.get("/socket")),
  });

  useEffect(() => {
    // if socket server connection fails or session status is
    //  in loading state then don't open the socket client connection
    if (!data?.success || status === "loading") return;

    // open the socket client connection with credentials
    const socketClient: Socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URI as string,
      {
        // autoConnect: false,
        withCredentials: true,
        auth: { user: session?.user },
      },
    );

    // store the socket client instance in order that we can
    // access it from any component
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [data, status]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
