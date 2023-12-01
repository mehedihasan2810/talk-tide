import { cn } from "@/lib/utils";
import { ChatInterface } from "@/types/chat";
import { SessionUser } from "@/types/session";
import { getChatObjectMetadata } from "@/utils/getChatObjectMetadata";
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  PaperClipIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { FC } from "react";
import moment from "moment";
import { useStore } from "@/lib/stores/useStore";
import { usePathname, useRouter } from "next/navigation";
import { useDeleteChat } from "../hooks/mutations/useDeleteChat";
import { useCreateQueryString } from "../hooks/useCreateQueryString";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  chat: ChatInterface;
  onClick: (_chat: ChatInterface) => void;
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
  const { toggleGroupDetailsModal } = useStore();

  const { mutate: deleteChatMutation } = useDeleteChat();

  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // delete a specific query then return the remaining
  const createQueryString = useCreateQueryString();

  // if there is no chat then we don't want to render anything
  if (!chat) return;

  return (
    <div
      role="button"
      onClick={() => onClick(chat)}
      className={cn(
        "group relative isolate my-2 flex cursor-pointer items-start justify-between gap-3 overflow-hidden rounded-3xl border p-4 hover:bg-primary/5",
        isActive ? "border-primary  bg-primary/5" : "",
        unreadCount > 0 ? "border-primary bg-primary/10 font-bold" : "",
      )}
    >
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

      <div className="w-full">
        <div className="flex gap-2">
          <p className="max-w-[200px] truncate">
            {" "}
            {getChatObjectMetadata(chat, user).title}
          </p>
          {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
          {unreadCount <= 0 ? null : (
            <Badge className="bg-primary/90">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </div>
        <div className="inline-flex w-full items-center text-left">
          {chat.chatMessages[0] &&
          chat.chatMessages[0].attachments.length > 0 ? (
            // If last message is an attachment show paperclip
            <PaperClipIcon className="mr-2 flex h-3 w-3 flex-shrink-0 text-black/50" />
          ) : null}
          <small className="max-w-[150px] truncate text-sm text-zinc-500">
            {getChatObjectMetadata(chat, user).lastMessage}
          </small>

          <small className="ml-2 w-max font-semibold">
            {moment(chat.chatMessages[0]?.updatedAt || chat.updatedAt)
              .add("TIME_ZONE", "hours")
              .fromNow(true)}
          </small>
        </div>
      </div>

      <Popover>
        <PopoverTrigger
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute right-4 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full border border-primary/30  p-1 text-primary group-hover:opacity-100 md:opacity-0"
        >
          <EllipsisVerticalIcon className=" h-6 w-6" />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          className="w-fit border-none bg-none p-0 shadow-none"
        >
          {chat.isGroupChat ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();

                router.replace(pathname + createQueryString("cD", chat.id), {
                  scroll: false,
                });

                toggleGroupDetailsModal(true);
              }}
              className="inline-flex items-center rounded-lg p-4"
            >
              <InformationCircleIcon className="mr-2 h-4 w-4" /> About group
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger
                className={buttonVariants({
                  variant: "destructive",
                  className: "inline-flex items-center",
                  size: "sm",
                })}
                onClick={(e) => e.stopPropagation()}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete chat
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Are you sure you want to delete this chat?
                  </DialogTitle>
                </DialogHeader>

                <DialogFooter className="mx-auto">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatMutation(chat.id, {
                        onError: (error) => {
                          toast({
                           title: error.message,
                            variant: "destructive",
                          });
                        },
                      });
                      onChatDelete(chat.id);
                      toast({
                        description: "Chat deleted successfully",
                        variant: "success",
                      });
                    }}
                    size="sm"
                    variant="destructive"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatItem;
