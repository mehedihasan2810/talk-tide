import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getSession } from "next-auth/react";

// Function to establish a socket connection with authorization token
const getSocket = async () => {
  // "undefined" means the URL will be computed from the `window.location` object
  //   const URL =
  //     process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

  const session = await getSession();
  console.log(session);

  // Create a socket connection with the provided URI and authentication
  return io(process.env.NEXT_PUBLIC_SOCKET_URI as string, {
    autoConnect: false,
    path: "/api/socket",
    withCredentials: true,
    auth: { user: session?.user || null },
    // transports: ['websocket']
  });
};

// Create a context to hold the socket instance
const SocketContext = createContext<{
  socket: ReturnType<typeof io> | null;
}>({
  socket: null,
});
// --------------------------------------------

// Custom hook to access the socket instance from the context
const useSocket = () => useContext(SocketContext);
// -----------------------------------------------------

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  // Set up the socket connection when the component mounts
  useEffect(() => {
    async function sessionHelper() {
      setSocket(await getSocket());
    }
    sessionHelper();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
