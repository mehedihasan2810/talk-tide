import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Props {
  user: string;
}

const SelectItem = ({ user }: Props) => {
  return (
    <div className="flex gap-1 items-center p-1 border w-fit rounded-full">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{user[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <div
        title={user}
        className="w-12 whitespace-nowrap overflow-hidden overflow-ellipsis"
      >
        {user}
      </div>
      <button className="w-fit border p-[2px] rounded-full hover:border-gray-400">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SelectItem;