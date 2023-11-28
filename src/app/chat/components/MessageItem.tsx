import { cn } from "@/lib/utils";
import { ChatMessageInterface } from "@/types/chat";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Link from "next/link";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  message: ChatMessageInterface;
  isOwnMessage?: boolean;
  isGroupChatMessage?: boolean;
  isRecentMessage: boolean;
  isMessageSendPending: boolean;
}

const MessageItem: FC<Props> = ({
  message,
  isOwnMessage,
  isGroupChatMessage,
  isRecentMessage,
  isMessageSendPending,
}) => {
  const [resizedImage, setResizedImage] = useState("");
  const [isShowTime, setIsShowTime] = useState(false);
  return (
    <div
      className={cn(
        "group flex w-fit max-w-[80%] items-end  gap-2",
        isOwnMessage ? "ml-auto justify-end" : "justify-start",
      )}
    >
      <Avatar
        className={cn(
          "flex h-6 w-6 flex-shrink-0 rounded-full object-cover ",
          isOwnMessage ? "order-2" : "order-1",
          isRecentMessage && isOwnMessage ? "mb-5" : "",
        )}
      >
        <AvatarImage alt="author image" src={message.sender.avatar.url} />
        <AvatarFallback className="bg-zinc-200">
          {message.sender.username[0].toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "group/tooltip relative w-full",
          isOwnMessage ? "order-1" : "order-2",
        )}
      >
        <div
          className={cn(
            "absolute bottom-0 left-1/2 z-50 w-max -translate-x-1/2 rounded-md border bg-popover bg-white px-3 py-1.5 text-sm text-popover-foreground opacity-0 shadow-md group-hover/tooltip:bottom-full group-hover/tooltip:opacity-100",
          )}
        >
          {moment(message.createdAt).calendar()}
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsShowTime(!isShowTime);
          }}
        >
          <div className="flex flex-col">
            <div
              className={cn(
                "mb-[6px] overflow-hidden text-center text-sm text-zinc-500 transition-all",
                isShowTime ? "h-5" : "h-0",
              )}
            >
              {moment(message.createdAt).calendar()}
            </div>
            {isGroupChatMessage && !isOwnMessage ? (
              <p className={cn("mb-[1px] ml-3 text-xs text-zinc-500")}>
                {message.sender?.username}
              </p>
            ) : null}

            {message.attachments.length > 0 ? (
              <div
                className={cn(
                  "ml-auto grid w-fit gap-2",
                  message.attachments?.length === 1 ? " grid-cols-1" : "",
                  message.attachments?.length === 2 ? " grid-cols-2" : "",
                  message.attachments?.length >= 3 ? " grid-cols-3" : "",
                  message.content ? "mb-[1px]" : "",
                )}
              >
                {message.attachments.map((file, index) => {
                  return (
                    <div
                      key={index}
                      className="group/t relative aspect-square cursor-pointer overflow-hidden rounded-xl "
                    >
                      <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-150 ease-in-out group-hover/t:opacity-100">
                        <Dialog>
                          <DialogTrigger
                            onClick={() => setResizedImage(file.url)}
                          >
                            {" "}
                            <MagnifyingGlassPlusIcon className="h-6 w-6 text-white" />
                          </DialogTrigger>
                          <DialogContent className="h-full w-full max-w-full">
                            <Image
                              className="object-contain"
                              src={resizedImage}
                              alt="chat image"
                              fill
                            />
                          </DialogContent>
                        </Dialog>

                        <Link
                          href={file.url}
                          download
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowDownTrayIcon
                            title="download"
                            className="h-6 w-6 cursor-pointer text-white hover:text-zinc-400"
                          />
                        </Link>
                      </div>
                      <Image
                        className="h-[200px] w-[200px] object-cover"
                        src={file.url}
                        alt="msg_img"
                        width={200}
                        height={200}
                        // fill
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {message.content !== "" ? (
              <p
                className={cn(
                  "max-w-full break-words rounded-3xl px-5 py-2 text-base shadow",
                  isOwnMessage
                    ? "ml-auto rounded-br-none bg-primary text-white"
                    : "mr-auto rounded-bl-none bg-white",
                )}
              >
                {message.content}
              </p>
            ) : null}
          </div>
        </div>
        {isRecentMessage && isOwnMessage ? (
          <div className="ml-auto w-fit text-sm text-gray-500">
            {isMessageSendPending ? " Sending..." : " Sent"}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MessageItem;
