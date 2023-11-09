import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/stores/useStore";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Props {
  type: string;
  user: string;
}

const SelectItem = ({ type, user }: Props) => {
  const { removeGroupParticipants, removeSelectedUser } = useStore(
    (state) => state,
  );
  return (
    <div className="flex w-fit items-center gap-1 rounded-full border p-1">
      <Avatar title={user} className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{user[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <div
        title={user}
        className="w-12 overflow-hidden overflow-ellipsis whitespace-nowrap"
      >
        {user}
      </div>
      <Button
        onClick={() =>
          type === "oneToOne"
            ? removeSelectedUser(user)
            : removeGroupParticipants(user)
        }
        className="h-7 w-7 rounded-full p-1"
        variant="outline"
      >
        <XMarkIcon className="h-full w-full" />
      </Button>
    </div>
  );
};

export default SelectItem;
