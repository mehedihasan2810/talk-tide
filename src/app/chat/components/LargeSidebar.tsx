import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/stores/useStore";
import SelectItem from "./SelectItem";
import SelectUser from "./SelectUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";

const LargeSidebar = () => {
  const {
    isGroupChat,
    groupName,
    selectedUser,
    groupParticipants,
    updateGroupName,
    updateIsGroupChat,
  } = useStore((state) => state);

  return (
    <div>
      {/* todo */}
      <div className="mb-4 flex h-14 items-center justify-between border-b px-4">
        <p>hello my name is</p>
        <Button className="h-8 w-8 rounded-full p-1" variant="outline">
          <Cog6ToothIcon className="h-full w-full text-gray-700" />
        </Button>
      </div>

      <div className="px-2">
        {/* toggle if the chat is group chat or one to one chat*/}
        <div className="mb-2 flex items-center space-x-2">
          <Switch
            checked={isGroupChat}
            onCheckedChange={updateIsGroupChat}
            id="group-chat"
          />
          <Label htmlFor="group-chat">Is it a group chat?</Label>
        </div>
        {/* ----------------------------------------------------- */}

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

        {/* 
        map the selected group participants avatar or
        show a single user avatar 
        */}
        <div className="mb-2 flex flex-wrap  gap-1">
          {isGroupChat
            ? groupParticipants.map((user, index) => (
                <SelectItem key={index} type="groupChat" user={user} />
              ))
            : selectedUser && (
                <SelectItem type="oneToOne" user={selectedUser} />
              )}
        </div>
        {/* -------------------------------------------------------- */}

        {/* select user for chat */}
        <SelectUser />
        {/* --------------------- */}
      </div>
    </div>
  );
};

export default LargeSidebar;
