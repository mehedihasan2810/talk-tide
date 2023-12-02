import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import SelectUser from "./SelectUser";
import { Switch } from "@/components/ui/switch";
import React, { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import SelectItem from "./SelectItem";
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/stores/useStore";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";
import ChatItem from "./ChatItem";
import { getChatObjectMetadata } from "@/utils/getChatObjectMetadata";
import { SessionUser } from "@/types/session";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatSidebarSkeleton from "../skeletons/ChatSidebarSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { OnHandleClickCreateChatType } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  chats: ChatInterface[];
  isChatsLoading: boolean;
  onHandleClickCreateChat: OnHandleClickCreateChatType;
  isChatCreating: boolean;
  isGroupChatCreating: boolean;
  currentChatId: string | null;
  setCurrentChat(_chat: ChatInterface): void;
  unreadMessages: ChatMessageInterface[];
  onChatDelete(_chatId: string): void;
}

const MobileSidebar: FC<Props> = ({
  chats,
  isChatsLoading,
  onHandleClickCreateChat,
  isChatCreating,
  isGroupChatCreating,
  currentChatId,
  setCurrentChat,
  unreadMessages,
  onChatDelete,
}) => {
  const [chatSearchTerm, setChatSearchTerm] = useState<string>("");
  const [participant, setParticipant] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  /**
   * get the user session or if the user is not authenticated
   * then redirect him to auth page
   */
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth");
    },
  });

  const { isMobileSidebarOpen, toggleIsMobileSidebarOpen } = useStore(
    (state) => state,
  );

  /**
   * The function `onHandleSelectUser` handles the selection of a user in a chat, either by updating
   * the group participants array or setting the participant for a one-to-one chat.
   * @param {string} participantId - The `participantId` parameter is a string that represents the
   * unique identifier of a participant in a chat.
   */
  const onHandleSelectUser = (participantId: string) => {
    if (isGroupChat) {
      // if it is group chat then track the users in an array
      setGroupParticipants((prevParticipants) => {
        if (prevParticipants.includes(participantId)) return prevParticipants;
        return [...prevParticipants, participantId];
      });
    } else {
      // if it is one to one chat then set the user
      setParticipant(participantId);
    }
  };

  return (
    <Sheet open={isMobileSidebarOpen}>
      <SheetContent
        data-testid="sidebar-dialog"
        className="flex w-full flex-col overflow-y-auto pb-0 sm:max-w-[500px]"
        side="right"
      >
        <div>
          <SheetHeader className="mb-4">
            <Button
              onClick={toggleIsMobileSidebarOpen}
              className="h-9 w-9 rounded-full p-1"
              variant="outline"
            >
              <XMarkIcon className="h-full w-full" />
            </Button>
          </SheetHeader>

          <h3 className="mb-2 text-xl font-semibold text-primary">
            Create chat
          </h3>
          {/* toggle if the chat is group chat or one to one chat*/}
          <div className="mb-2 flex items-center space-x-2">
            <Switch
              checked={isGroupChat}
              onCheckedChange={setIsGroupChat}
              id="group-chat"
            />
            <Label htmlFor="group-chat">Is it a group chat?</Label>
          </div>
          {/* ----------------------------------------------------------*/}

          {/* 
            if it is group chat then toggle the input field for
            group name
        */}
          {isGroupChat && (
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
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
              ? groupParticipants.map((participantId, index) => (
                  <SelectItem
                    onRemoveUser={(participant) => {
                      setGroupParticipants((prevParticipants) =>
                        prevParticipants.filter((part) => part !== participant),
                      );
                    }}
                    key={index}
                    participantId={participantId}
                  />
                ))
              : participant && (
                  <SelectItem
                    onRemoveUser={() => {
                      setParticipant(null);
                    }}
                    participantId={participant}
                  />
                )}
          </div>
          {/* --------------------------------------------------- */}

          {/* select user for chat */}
          <div className="flex gap-2">
            <SelectUser
              isGroupChat={isGroupChat}
              onHandleSelect={onHandleSelectUser}
            />
            <Button
              disabled={isChatCreating || isGroupChatCreating}
              onClick={() => {
                onHandleClickCreateChat(
                  isGroupChat,
                  groupName,
                  groupParticipants,
                  participant,
                  () => setGroupName(""),
                  () => setGroupParticipants([]),
                  () => setParticipant(null),
                );
              }}
            >
              {(isChatCreating || isGroupChatCreating) && (
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold text-primary">
            Existing chats <small>({chats?.length})</small>
          </h3>
          <Input
            value={chatSearchTerm}
            onChange={(e) => setChatSearchTerm(e.target.value)}
            type="text"
            placeholder="Search chat..."
            className="mb-2 border-primary/40 text-base focus-visible:ring-primary"
          />
          <div>
            {isChatsLoading || status === "loading" ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ChatSidebarSkeleton key={index} />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="mt-8 text-center text-primary">
                <h6>No chat found!</h6>
                <p> Create a chat and start chatting</p>
              </div>
            ) : (
              chats
                .filter((chat) =>
                  chatSearchTerm.trim() !== ""
                    ? getChatObjectMetadata(chat, session.user as SessionUser)
                        .title?.toLocaleLowerCase()
                        ?.includes(chatSearchTerm.toLocaleLowerCase())
                    : true,
                )
                .sort((chatA, chatB) =>
                  (
                    chatB.chatMessages[0]?.updatedAt || chatB.updatedAt
                  ).localeCompare(
                    chatA.chatMessages[0]?.updatedAt || chatA.updatedAt,
                  ),
                )
                .map((chat: ChatInterface) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    onClick={(chat) => {
                      if (currentChatId && currentChatId === chat.id) return;
                      setCurrentChat(chat);
                    }}
                    user={session.user as SessionUser}
                    isActive={chat.id === currentChatId}
                    unreadCount={
                      unreadMessages.filter((n) => n.chatId === chat.id).length
                    }
                    onChatDelete={onChatDelete}
                  />
                ))
            )}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 mt-auto flex  items-center justify-between gap-2 rounded-md border-t border-t-primary/20 bg-zinc-100 p-4 px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>
                {session
                  ? (session?.user as SessionUser).name
                      ?.slice(0, 1)
                      ?.toLocaleUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold leading-4">
                {status === "loading" ? (
                  <Skeleton className="mb-1 h-4 w-20" />
                ) : (
                  (session?.user as SessionUser)?.name
                )}
              </div>

              <div className="text-sm text-zinc-500">
                {status === "loading" ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  (session?.user as SessionUser)?.email
                )}
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              toast({
                description: "Successfully logged out",
                variant: "success",
              });
            }}
            className="w-h-10 group relative h-10 rounded-full border p-[6px] text-gray-500 hover:text-gray-400"
          >
            <div className="absolute bottom-[110%] right-0 w-max rounded-sm bg-gray-800 px-3 py-1 text-sm text-gray-300 opacity-0 group-hover:opacity-100">
              Log out
            </div>
            <ArrowRightOnRectangleIcon className="h-full w-full " />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
