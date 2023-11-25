import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface Props {
  isOwnMessage: boolean;
}

const MessageItemSkeleton: FC<Props> = ({ isOwnMessage }) => {
  return (
    <div
      className={cn(
        "flex w-fit items-end gap-2",
        isOwnMessage ? "ml-auto justify-end" : "justify-start",
      )}
    >
      <Skeleton
        className={cn(
          "h-6 w-6 rounded-full",
          isOwnMessage ? "order-2 bg-primary" : "order-1",
        )}
      />

      <Skeleton
        className={cn(
          "h-10 w-40 rounded-3xl",
          isOwnMessage
            ? "order-1 rounded-br-none bg-primary"
            : "order-2 rounded-bl-none",
        )}
      />
    </div>
  );
};

export default MessageItemSkeleton;
