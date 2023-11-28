import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useUsers } from "../hooks/queries/useUsers";

interface Props {
  participantId: string;
  onRemoveUser(_user: string): void;
}

const SelectItem = ({ participantId, onRemoveUser }: Props) => {

  const { data: users = { data: [] } } = useUsers(); // fetch a list of users

  const username = users.data.find((user) => user.id === participantId)
    ?.username; // get the username of the selected participant

  const avatar = users.data.find((user) => user.id === participantId)?.avatar; // get the avatar of selected participant

  return (
    <div className="flex w-fit items-center gap-1 rounded-full border border-primary/40 p-1">
      <Avatar title={username} className="h-6 w-6">
        <AvatarImage src={avatar?.url} />
        <AvatarFallback>
          {username ? username[0]?.toUpperCase() : "N"}
        </AvatarFallback>
      </Avatar>

      <div
        title={username}
        className="w-16 overflow-hidden overflow-ellipsis whitespace-nowrap"
      >
        {username}
      </div>
      <Button
        onClick={() => onRemoveUser(participantId)}
        className="h-6 w-6 rounded-full border-primary/40 p-1"
        variant="outline"
      >
        <XMarkIcon className="h-full w-full" />
      </Button>
    </div>
  );
};

export default SelectItem;
