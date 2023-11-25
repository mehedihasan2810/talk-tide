import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ChatSidebarSkeleton = () => {
  return (
    <div className="flex items-center gap-2 rounded-3xl border px-2 py-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export default ChatSidebarSkeleton;
