import { cn } from "@/lib/utils";
import { ChatListItemInterface } from "@/types/chat";
import { SessionUser } from "@/types/types";
import { getChatObjectMetadata } from "@/utils/getChatObjectMetadata";
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  PaperClipIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { FC, useState } from "react";
import moment from "moment";
import { useStore } from "@/lib/stores/useStore";

interface Props {
  chat: ChatListItemInterface;
  onClick: (_chat: ChatListItemInterface) => void;
  isActive?: boolean;
  unreadCount?: number;
  onChatDelete: (_chatId: string) => void;
  user: SessionUser;
}

const ChatItem: FC<Props> = ({
  chat,
  onClick,
  user,
  isActive,
  unreadCount = 0,
  onChatDelete,
}) => {
  const [openOptions, setOpenOptions] = useState(false);
  const [openGroupInfo, setOpenGroupInfo] = useState(false);
  console.log(openGroupInfo)

  const { deleteChat } = useStore((state) => state);

  if (!chat) return;

  return (
    <>
      {/* TODO: Create modal to show group chat details */}
      {/* <GroupChatDetailsModal
        open={openGroupInfo}
        onClose={() => {
          setOpenGroupInfo(false);
        }}
        chatId={chat._id}
        onGroupDelete={onChatDelete}
      /> */}

      <div
        role="button"
        onClick={() => onClick(chat)}
        className={cn(
          "group my-2 flex cursor-pointer items-start justify-between gap-3 rounded-3xl p-4 hover:bg-secondary",
          isActive ? "border-[1px] border-zinc-500 bg-secondary" : "",
          unreadCount > 0
            ? "border-success bg-success/20 border-[1px] font-bold"
            : "",
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
          className="relative self-center p-1"
        >
          <EllipsisVerticalIcon className="h-6 w-0 text-zinc-300 opacity-0 transition-all duration-100 ease-in-out group-hover:w-6 group-hover:opacity-100" />

          <div
            className={cn(
              "absolute bottom-0 z-20 w-52 translate-y-full rounded-2xl border-[1px] border-secondary bg-gray-200 p-2 text-left text-sm shadow-md",
              openOptions ? "block" : "hidden",
            )}
          >
            {chat.isGroupChat ? (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenGroupInfo(true);
                }}
                role="button"
                className="inline-flex w-full items-center rounded-lg p-4 hover:bg-secondary"
              >
                <InformationCircleIcon className="mr-2 h-4 w-4" /> About group
              </p>
            ) : (
              <p
                onClick={async (e) => {
                  e.stopPropagation();
                  const ok = confirm(
                    "Are you sure you want to delete this chat?",
                  );
                  if (ok) {
                    await deleteChat(chat.id, onChatDelete);
                  }
                }}
                role="button"
                className="text-danger inline-flex w-full items-center rounded-lg p-4 hover:bg-secondary"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete chat
              </p>
            )}
          </div>
        </button>

        {/* ----------------------------------------- */}

        <div className="flex flex-shrink-0 items-center justify-center">
          {chat.isGroupChat ? (
            <div className="relative flex h-12 w-12 flex-shrink-0 flex-nowrap items-center justify-start">
              {chat.participants.slice(0, 3).map((participant, i) => {
                return (
                  <Image
                    key={participant.id}
                    src={participant.avatar.url}
                    width={48}
                    height={48}
                    className={cn(
                      "outline-dark absolute h-7 w-7 rounded-full border-[1px] border-white outline outline-4 group-hover:outline-secondary",
                      i === 0
                        ? "left-0 z-[3]"
                        : i === 1
                        ? "left-2.5 z-[2]"
                        : i === 2
                        ? "left-[18px] z-[1]"
                        : "",
                    )}
                    alt="chat participant image"
                  />
                );
              })}
            </div>
          ) : (
            <Image
              src={getChatObjectMetadata(chat, user).avatar as string}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
              alt="chat participant image"
            />
          )}
        </div>

        {/* ----------------------------------------- */}

        <div className="w-full">
          <p className="truncate-1">
            {getChatObjectMetadata(chat, user).title}
          </p>
          <div className="inline-flex w-full items-center text-left">
            {chat.chatMessages[0] &&
            chat.chatMessages[0].attachments.length > 0 ? (
              // If last message is an attachment show paperclip
              <PaperClipIcon className="mr-2 flex h-3 w-3 flex-shrink-0 text-white/50" />
            ) : null}
            <small className="truncate-1 inline-flex items-center text-ellipsis text-sm text-white/50">
              {getChatObjectMetadata(chat, user).lastMessage}
            </small>
          </div>
        </div>

        {/* -------------------------------------------- */}

        <div className="flex h-full flex-col items-end justify-between text-sm text-white/50">
          <small className="mb-2 inline-flex w-max flex-shrink-0">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>

          {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
          {unreadCount <= 0 ? null : (
            <span className="bg-success inline-flex aspect-square h-2 w-2 flex-shrink-0 items-center justify-center rounded-full p-2 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        {/* --------------------------------------------- */}
      </div>
    </>
  );
};

export default ChatItem;
