import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import SelectUser from "./SelectUser";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/stores/chatStores";
import SelectItem from "./SelectItem";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MobileSidebar = () => {
  const {
    groupName,
    isGroupChat,
    groupParticipants,
    selectedUser,
    isMobileSidebarOpen,
    updateGroupName,
    updateIsGroupChat,
    toggleIsMobileSidebarOpen,
  } = useChatStore((state) => state);

  return (
    <Sheet open={isMobileSidebarOpen}>
      <SheetContent
        data-testid="sidebar-dialog"
        className="flex flex-col justify-between"
        side="right"
      >
        <div>
          <SheetHeader className="mb-4">
            <div className="flex justify-between items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>

              <Button
                onClick={toggleIsMobileSidebarOpen}
                className="w-9 h-9 p-1 rounded-full"
                variant="outline"
              >
                <XMarkIcon className="w-full h-full" />
              </Button>
            </div>
          </SheetHeader>

          {/* toggle if the chat is group chat or one to one chat*/}
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              checked={isGroupChat}
              onCheckedChange={updateIsGroupChat}
              id="group-chat"
            />
            <Label htmlFor="group-chat">Is it a group chat?</Label>
          </div>
          {/* ----------------------------------------------------------*/}

          {/* 
        map the selected group participants avatar or
        show a single user avatar 
        */}
          <div className="flex flex-wrap gap-1  mb-2">
            {isGroupChat
              ? groupParticipants.map((user, index) => (
                  <SelectItem key={index} type="groupChat" user={user} />
                ))
              : selectedUser && (
                  <SelectItem type="oneToOne" user={selectedUser} />
                )}
          </div>
          {/* --------------------------------------------------- */}

          {/* 
            if it is group chat then toggle the input field for
            group name
        */}
          {isGroupChat && (
            <Input
              value={groupName}
              onChange={(e) => updateGroupName(e.target.value)}
              type="text"
              placeholder="Group name..."
              className="mb-2 border-gray-300"
            />
          )}
          {/* -------------------------------------------------------- */}

          {/* select user for chat */}
          <SelectUser />
          {/* --------------------- */}
        </div>

        <SheetFooter>
          <h2 className="text-center">TALK TIDE</h2>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
