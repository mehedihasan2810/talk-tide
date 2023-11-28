import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Talk Tide | Auth",
  description:
    "Talk Tide is a chatting platform where you can chat with your favorite person more securely than ever",
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default AuthLayout;
