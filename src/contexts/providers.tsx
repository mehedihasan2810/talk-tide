"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketContext";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

export const queryClient = new QueryClient();

const Provider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();


  // render the navbar and footer in all pages but not in chat page
  const renderNavFooter =
    pathname !== "/chat" ? (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    ) : (
      children
    );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>{renderNavFooter}</SocketProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Provider;
