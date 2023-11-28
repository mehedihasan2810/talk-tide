import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsers } from "../hooks/queries/useUsers";

type Props = {
  isGroupChat?: boolean;
  onHandleSelect(_participantId: string): void;
};

const SelectUser: FC<Props> = ({ isGroupChat, onHandleSelect }) => {
  const [open, setOpen] = useState(false); // toggle state of the popover
  const [value, setValue] = useState(""); // track the value of select element
  const { data: users = { data: [] }, error, isPending } = useUsers(); // fetch a list of users

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-primary/40 text-gray-500 hover:border-primary hover:bg-transparent hover:text-gray-500"
        >
          {value
            ? users.data.find((user) => user.username === value)?.username
            : "Select Participant..."}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <Command>
          <CommandInput placeholder="Search User..." className="h-9" />
          <CommandEmpty>No User Found</CommandEmpty>
          <CommandGroup className="max-h-96 overflow-y-auto">
            {error ? (
              <div>Something went wrong! Try again by refreshing the page</div>
            ) : isPending ? (
              <div>Loading...</div>
            ) : (
              users.data.map((user) => (
                <CommandItem
                  className="cursor-pointer"
                  key={user.id}
                  value={user.username}
                  onSelect={(currentValue) => {
                    // -------------------------------
                    onHandleSelect(user.id);

                    setValue(currentValue === value ? "" : currentValue);
                    !isGroupChat && setOpen(false);
                  }}
                >
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src={user.avatar.url} />
                    <AvatarFallback>
                      {user.username[0].toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.username}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === user.username ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectUser;
