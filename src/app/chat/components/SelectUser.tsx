import * as React from "react";

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
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useStore } from "@/lib/stores/useStore";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function SelectUser() {
  // STATE
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const isGroupChat = useStore((state) => state.isGroupChat);

  // ACTION
  const updateSelectedUser = useStore((state) => state.updateSelectedUser);
  const updateGroupParticipants = useStore(
    (state) => state.updateGroupParticipants,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex gap-2">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-gray-300"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select User..."}
            <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {/* add a user or users to start chat */}
        <Button className="border-gray-300 px-3">Start</Button>
        {/* --------------------------------------- */}
      </div>

      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search User..." className="h-9" />
          <CommandEmpty>No User Found</CommandEmpty>
          <CommandGroup className="max-h-96 overflow-y-auto">
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  // -------------------------------
                  if (isGroupChat) {
                    // if it is group chat then track the users in an array
                    updateGroupParticipants(currentValue);
                  } else {
                    // if it is one to one chat then set the user
                    updateSelectedUser(currentValue);
                  }
                  //   ----------------------------------

                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {framework.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
