"use client";
import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import { useCreateQueryString } from "@/app/chat/hooks/useCreateQueryString";

const Auth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCreateQueryString();

  return (
    <section>
      {searchParams.get("authPage") !== "register" ? (
        <Login
          updateIsLogin={() => {
            // store authPage state in url so that we can
            // persist our page on page reloading
            router.replace(
              pathname + createQueryString("authPage", "register"),
            );
          }}
        />
      ) : (
        <Register
          updateIsLogin={() => {
            // store authPage state in url so that we can
            // persist our page on page reloading
            router.replace(pathname + createQueryString("authPage", "login"));
          }}
        />
      )}
    </section>
  );
};

Auth.pageName = "auth";

export default Auth;
