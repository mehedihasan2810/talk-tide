import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SelectItem from "./SelectItem";
import SelectUser from "./SelectUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/react/20/solid";
import { FC, useState } from "react";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";
import { signOut, useSession } from "next-auth/react";
import { getChatObjectMetadata } from "@/utils/getChatObjectMetadata";
import { SessionUser } from "@/types/session";
import ChatItem from "./ChatItem";
import ChatSidebarSkeleton from "../skeletons/ChatSidebarSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { OnHandleClickCreateChatType } from "../types";

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

const Sidebar: FC<Readonly<Props>> = ({
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
  const { toast } = useToast();

  const [chatSearchTerm, setChatSearchTerm] = useState<string>("");
  const [participant, setParticipant] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);

  /*
    get the current user session or if the user is not authenticated then
    redirect him to auth page
    */
  const { data: session, status } = useSession();

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
    <div className="hidden h-full md:block">
      <div className="flex h-14 items-center justify-between border-b border-b-primary/20 px-4">
        <Link href="/">
          <div className="relative isolate text-2xl font-semibold text-primary-foreground">
            <svg
              className="absolute left-1/2 top-0 -z-10
         h-[120%] w-[130%] -translate-x-1/2"
              width="390"
              height="100"
              viewBox="0 0 390 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.7313 23.391C109.247 17.6251 202.879 17.179 296.54 16.1553C297.212 16.148 331.206 14.1268 312.8 17.3748C288.651 21.6365 264.284 24.06 239.956 27.0495C165.808 36.1608 92.1668 51.1955 17.3573 51.1955C-61.7473 51.1955 175.566 51.1955 254.671 51.1955C276.866 51.1955 299.061 51.1955 321.255 51.1955C337.706 51.1955 354.07 50.2428 370.279 53.3093C385.217 56.1353 356.375 57.2669 353.288 57.6995C329.843 60.9835 306.503 64.7998 282.801 65.5855C259.326 66.3637 235.932 65.9662 212.476 67.618C173.892 70.3352 135.291 74.5097 96.7871 78.187C76.3725 80.1367 55.5268 79.0182 35.4871 83.4715C32.8341 84.061 40.8187 84.7132 43.5358 84.7722C63.5749 85.2079 83.6547 84.8535 103.698 84.8535C142.017 84.8535 180.336 84.8535 218.655 84.8535C262.079 84.8535 306.333 83.3902 349.385 83.3902"
                stroke="#008080"
                strokeWidth="30"
                strokeLinecap="round"
              />
            </svg>
            Talk Tide
          </div>
        </Link>

        <div className="inline-flex items-center  gap-3">
          <Link
            href="/"
            className="h-7 w-7 text-primary opacity-70 hover:opacity-100"
          >
            <HomeIcon className="h-full w-full" />
          </Link>
          <button className="h-7 w-7 text-primary opacity-70 hover:opacity-100">
            <Cog6ToothIcon className="h-full w-full" />
          </button>
        </div>
      </div>

      <div
        id="sidebar"
        className="relative flex h-[calc(100vh-91px)] flex-col justify-between overflow-y-auto overflow-x-hidden py-4 pb-0"
      >
        <div>
          <h3 className="mb-2 px-2 text-2xl font-semibold text-primary">
            Create chat
          </h3>
          <div className="px-2">
            {/* toggle if the chat is group chat or one to one chat*/}
            <div className="mb-2 flex items-center space-x-2">
              <Switch
                checked={isGroupChat}
                onCheckedChange={setIsGroupChat}
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
                onChange={(e) => setGroupName(e.target.value)}
                type="text"
                placeholder="Group name..."
                className="mb-2 border-primary/40 text-base focus-visible:ring-primary"
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
                          prevParticipants.filter(
                            (part) => part !== participant,
                          ),
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
            {/* -------------------------------------------------------- */}

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
                variant="outline"
              >
                {(isChatCreating || isGroupChatCreating) && (
                  <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </div>
            {/* --------------------- */}
          </div>
          <div className="mt-4 px-2">
            <h3 className="mb-2 text-2xl font-semibold text-primary">
              Existing chats <small>({chats.length})</small>
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
                  {Array.from({ length: 3 }).map((_, index) => (
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
                      ? getChatObjectMetadata(
                          chat,
                          session?.user as SessionUser,
                        )
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
                        if (currentChatId === chat.id) return;
                        setCurrentChat(chat);
                      }}
                      user={session?.user as SessionUser}
                      isActive={chat.id === currentChatId}
                      unreadCount={
                        unreadMessages.filter((n) => n.chatId === chat.id)
                          .length
                      }
                      onChatDelete={onChatDelete}
                    />
                  ))
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 flex h-[73px] items-center justify-between gap-2 border-t border-t-primary/20 bg-zinc-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
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
      </div>
    </div>
  );
};

export default Sidebar;
