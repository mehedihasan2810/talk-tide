import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchSelect from "./SearchSelect";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/stores/chatStores";
import SelectItem from "./SelectItem";

const MobileSidebar = () => {
  const {
    groupName,
    isGroupChat,
    groupParticipants,
    selectedUser,
    updateGroupName,
    updateIsGroupChat,
  } = useChatStore((state) => state);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Talk Tide</SheetTitle>
        </SheetHeader>

        {/* switch button start */}
        <div className="flex items-center space-x-2 mb-2">
          <Switch
            checked={isGroupChat}
            onCheckedChange={updateIsGroupChat}
            id="group-chat"
          />
          <Label htmlFor="group-chat">Is it a group chat?</Label>
        </div>
        {/* switch button end */}

        {/* todo */}
        <div className="flex flex-wrap gap-1  mb-2">
          {isGroupChat
            ? groupParticipants.map((user, index) => (
                <SelectItem key={index} user={user} />
              ))
            : selectedUser && <SelectItem user={selectedUser} />}
        </div>

        {isGroupChat && (
          <Input
            value={groupName}
            onChange={(e) => updateGroupName(e.target.value)}
            type="text"
            placeholder="Group name..."
            className="mb-2 border-gray-300"
          />
        )}

        {/* SearchSelect component */}
        <SearchSelect />

        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
