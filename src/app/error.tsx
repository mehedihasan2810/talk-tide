"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center bg-white">
      <div className="text-center">
        <h2 className="mb-4 text-lg text-rose-500">Something went wrong!</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <br />
        <br />
        <p>
          Or go to{" "}
          <Link className="text-teal-500 underline" href="/">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
