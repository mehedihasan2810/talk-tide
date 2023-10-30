import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/stores/chatStores";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Props {
  type: string;
  user: string;
}

const SelectItem = ({ type, user }: Props) => {
  const { removeGroupParticipants, removeSelectedUser } = useChatStore(
    (state) => state
  );
  return (
    <div className="flex gap-1 items-center p-1 border w-fit rounded-full">
      <Avatar title={user} className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{user[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <div
        title={user}
        className="w-12 whitespace-nowrap overflow-hidden overflow-ellipsis"
      >
        {user}
      </div>
      <Button
        onClick={() =>
          type === "oneToOne"
            ? removeSelectedUser(user)
            : removeGroupParticipants(user)
        }
        className="w-7 h-7 p-1 rounded-full"
        variant="outline"
      >
        <XMarkIcon className="h-full w-full" />
      </Button>
    </div>
  );
};

export default SelectItem;
