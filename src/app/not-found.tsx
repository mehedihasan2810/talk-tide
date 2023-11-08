"use client";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const authRelatedPathnames = ["login", "register", "signin", "signup"];

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const requestedPath = authRelatedPathnames.find((path) =>
      pathname?.includes(path)
    );
    // if url contains register or signup then
    // redirect user to register page
    if (requestedPath === "register" || requestedPath === "signup")
      router.replace("/auth?authPage=register");
    // ----------------------------------------------

    // if url contains login or signin then
    // redirect user to login page
    if (requestedPath === "login" || requestedPath === "signin")
      router.replace("/auth?authPage=login");
    // ----------------------------------------
  }, [router, pathname]);

  return (
    <div className="h-screen grid place-items-center">
      <div className="flex h-5 items-center space-x-4">
        <h2>Not Found</h2>
        <Separator orientation="vertical" />
        <div>404</div>
        <Separator orientation="vertical" />
        <Link className="text-emerald-400 underline" href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
