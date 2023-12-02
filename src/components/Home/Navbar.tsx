"use client";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
const Navbar = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  return (
    <div className="fixed left-0 top-0 z-10  w-full border-b border-b-primary/40">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2 sm:py-4">
        <div className="relative text-2xl font-semibold text-primary-foreground">
          <svg
            className="absolute left-1/2 top-0 -z-10
         h-[120%] w-[130%] -translate-x-1/2"
            width="390"
            height="100"
            viewBox="0 0 390 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7313 23.391C109.247 17.6251 202.879 17.179 296.54 16.1553C297.212 16.148 331.206 14.1268 312.8 17.3748C288.651 21.6365 264.284 24.06 239.956 27.0495C165.808 36.1608 92.1668 51.1955 17.3573 51.1955C-61.7473 51.1955 175.566 51.1955 254.671 51.1955C276.866 51.1955 299.061 51.1955 321.255 51.1955C337.706 51.1955 354.07 50.2428 370.279 53.3093C385.217 56.1353 356.375 57.2669 353.288 57.6995C329.843 60.9835 306.503 64.7998 282.801 65.5855C259.326 66.3637 235.932 65.9662 212.476 67.618C173.892 70.3352 135.291 74.5097 96.7871 78.187C76.3725 80.1367 55.5268 79.0182 35.4871 83.4715C32.8341 84.061 40.8187 84.7132 43.5358 84.7722C63.5749 85.2079 83.6547 84.8535 103.698 84.8535C142.017 84.8535 180.336 84.8535 218.655 84.8535C262.079 84.8535 306.333 83.3902 349.385 83.3902"
              stroke="#008080"
              strokeWidth="30"
              strokeLinecap="round"
            />
          </svg>
          Talk Tide
        </div>

        <nav className="relative inline-flex items-center gap-6">
          <Link
            className="inline-flex items-center text-primary hover:underline"
            href="/"
          >
            Home
          </Link>
          <Link
            className="inline-flex items-center text-primary hover:underline"
            href="/chat"
          >
            My Inbox
          </Link>
          <Link
            className="hidden items-center text-primary hover:underline sm:inline-flex"
            href="#"
          >
            Features <ChevronRightIcon className="h-6 w-6" />
          </Link>
          <Link
            className="hidden text-primary hover:underline sm:inline-block"
            href="#"
          >
            Help Center
          </Link>
          {session ? (
            <Button
              onClick={async () => {
                await signOut();
                toast({
                  description: "Successfully logged out",
                  variant: "success",
                });
              }}
              variant="outline"
            >
              Log out
            </Button>
          ) : (
            <Link
              href="/auth"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
