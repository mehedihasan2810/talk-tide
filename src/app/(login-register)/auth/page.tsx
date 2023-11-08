"use client";
import React, { useCallback } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Login from "./components/Login";
import Register from "./components/Register";

const Auth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  // create a query string and then return it
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  // ------------------------------------------

  return (
    <>
      {searchParams.get("authPage") !== "register" ? (
        <Login
          updateIsLogin={() => {
            // store authPage state in url so that we can
            // persist our page on reloading
            router.push(
              pathname + "?" + createQueryString("authPage", "register")
            );
          }}
        />
      ) : (
        <Register
          updateIsLogin={() => {
            // store authPage state in url so that we can
            // persist our page on reloading
            router.push(
              pathname + "?" + createQueryString("authPage", "login")
            );
          }}
        />
      )}
    </>
  );
};

export default Auth;
