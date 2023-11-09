import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const SessionContext = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionContext;
