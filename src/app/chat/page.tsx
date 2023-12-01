"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore } from "@/lib/stores/useStore";
import { Button } from "@/components/ui/button";
import {
  Bars3Icon,
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  // CONNECTED_EVENT,
  // DISCONNECT_EVENT,
  // JOIN_CHAT_EVENT,
  LEAVE_CHAT_EVENT,
  MESSAGE_RECEIVED_EVENT,
  NEW_CHAT_EVENT,
  // STOP_TYPING_EVENT,
  // TYPING_EVENT,
  UPDATE_GROUP_NAME_EVENT,
} from "./constants";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";
import { Input } from "@/components/ui/input";
import Sidebar from "./components/Sidebar";
import { cn } from "@/lib/utils";
import { getChatObjectMetadata } from "@/utils/getChatObjectMetadata";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SessionUser } from "@/types/session";
import MessageItem from "./components/MessageItem";
import GroupChatDetailsModal from "./components/GroupChatDetailsModal";
import { useMessages } from "./hooks/queries/useMessages";
import { useCreateQueryString } from "./hooks/useCreateQueryString";
import { useChats } from "./hooks/queries/useChats";
import { useDeleteQueryString } from "./hooks/useDeleteQueryString";
import MobileSidebar from "./components/MobileSidebar";
// import { useSocket } from "@/contexts/SocketContext";
import { useSendChatMessage } from "./hooks/event-handlers/useSendChatMessage";
// import { useOnMessageChange } from "./hooks/event-handlers/useOnMessageChange";
import { useOnMessageReceive } from "./hooks/socket-event-handlers/useOnMessageReceive";
import { useOnNewChat } from "./hooks/socket-event-handlers/useOnNewChat";
import { useOnChatLeave } from "./hooks/socket-event-handlers/useOnChatLeave";
import { useOnGroupNameChange } from "./hooks/socket-event-handlers/useOnGroupNameChange";
import MessageItemSkeleton from "./skeletons/MessageItemSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import useOnHandleClickCreateChat from "./hooks/event-handlers/useOnHandleClickCreateChat";
import { pusherClient } from "@/lib/pusher";

const Chat = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const { toast } = useToast();

  const { toggleIsMobileSidebarOpen } = useStore(); //  get the `toggleIsMobileSidebarOpen` action from the global store

  // const { socket: socketClient } = useSocket(); // get the socket instance from the context

  /**
   * access the auth session and
   * if user is not authenticated then redirect him to the `auth` page
   */
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth");
    },
  });

  const createQueryString = useCreateQueryString(); // this `useCreateQueryString` hook returns a function which creates a query string based on provided key value and returns the string

  const deleteQueryString = useDeleteQueryString(); // this `useDeleteQueryString` hook returns a function which deletes a query string based on provided key and returns the remaining string

  // store the current chat id
  const currentChatIdRef = useRef<string | null>(null);

  /* The below code is using the `useMessages` hook to fetch messages data. It is destructuring the
returned values from the hook into variables `data`, `isPending`, and `error`. */
  const {
    data: messages = { data: [] },
    isPending: isMessagesPending,
    error: messagesError,
  } = useMessages(searchParams.get("c") || currentChatIdRef.current);

  /* The below code is using the `useChats` hook to retrieve data, loading status, and error
  information related to chats. It is using object destructuring to assign default values to the
  `chats`, `isChatsLoading`, and `chatsError` variables. If the `useChats` hook returns `undefined`
  for any of these values, the default values will be used instead. */
  const {
    data: chats = { data: [] },
    isPending: isChatsLoading,
    // error: chatsError,
  } = useChats();

  const chatMsgContainerRef = useRef<HTMLDivElement | null>(null); // for holding the ref of `chat message container`

  // const [isConnected, setIsConnected] = useState(false); // For tracking socket connection

  // const [isTyping, setIsTyping] = useState(false); // To track if someone is currently typing
  // const [isSelfTyping, setIsSelfTyping] = useState(false); // To track if the current user is typing

  const [message, setMessage] = useState(""); // To store the currently typed message
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    [],
  ); // To track unread messages
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]); // To store files attached to messages

  /* The below code is using the `useSendChatMessage` hook to initialize the `sendChatMessage` and
 `isMessageSendPending` variables. These variables are used to send chat messages, track if a
 message is currently being sent, and manage the state of the message and attached files. The
 `useSendChatMessage` hook takes in several parameters including the current chat ID, socket client,
 session, message, attached files, and functions to update the message and attached files. */
  const { sendChatMessage, isMessageSendPending } = useSendChatMessage(
    currentChatIdRef,
    // socketClient,
    session,
    message,
    attachedFiles,
    setMessage,
    setAttachedFiles,
    chats,
  );

  /* The below code is defining a function called `handleOnMessageChange` that is using the
 `useOnMessageChange` hook. This hook takes several parameters: `currentChatIdRef`, `socketClient`,
 `isConnected`, `isSelfTyping`, `setMessage`, and `setIsSelfTyping`. The purpose of this function is
 to handle changes in the message input field in a chat application. It updates the `message` state
 with the new value, and also updates the `isSelfTyping` state to indicate whether the user is
 currently typing a message. */
  // const handleOnMessageChange = useOnMessageChange(
  //   currentChatIdRef,
  //   // socketClient,
  //   // isConnected,
  //   isSelfTyping,
  //   setMessage,
  //   setIsSelfTyping,
  // );

  // const onConnect = () => {
  //   setIsConnected(true);
  // };

  // const onDisconnect = () => {
  //   setIsConnected(false);
  // };

  /**
   * Handles the "typing" event on the socket.
   */
  // const onSocketTyping = (chatId: string) => {
  //   // Check if the typing event is for the currently active chat.
  //   if (chatId !== currentChatIdRef.current) return;

  //   // Set the typing state to true for the current chat.
  //   setIsTyping(true);
  // };

  // /**
  //  * Handles the "stop typing" event on the socket.
  //  */
  // const onSocketStopTyping = (chatId: string) => {
  //   // Check if the stop typing event is for the currently active chat.
  //   if (chatId !== currentChatIdRef.current) return;

  //   // Set the typing state to false for the current chat.
  //   setIsTyping(false);
  // };

  /* The below code is using the `useOnMessageReceive` hook to handle the event of receiving a message
 in a chat. It takes the `currentChatIdRef`, `setUnreadMessages`, and `chats` as parameters. The
 `useOnMessageReceive` hook is likely a custom hook that handles the logic for updating the unread
 messages count and the chat data when a new message is received. */
  const onMessageReceive = useOnMessageReceive(
    currentChatIdRef,
    setUnreadMessages,
    chats,
  );

  /* 
  this `useOnNewChat` hook is responsible for returning a handler function 
  which handles adding the new created chat to cache and then invalidate
  the chats list
  */
  const onNewChat = useOnNewChat();

  /*
  this `useOnChatLeave` hook takes the current chat id and returns a handler 
  which handles deleting the chat from cache and invalidating the chats list 
  from which the user left
  */
  const onChatLeave = useOnChatLeave(
    currentChatIdRef,
    pathname,
    router,
    deleteQueryString,
  );

  /*
  this `useOnGroupNameChange` hook takes the current chat id and returns a handler which handles updating or changing the group name
  */
  const onGroupNameChange = useOnGroupNameChange();

  // find the current active chats
  const currentChat = chats.data.find(
    (chat) => chat.id === (searchParams.get("c") || currentChatIdRef.current),
  );

  /**
   * The function setCurrentChat sets the current chat, emits an event to join the chat, filters out
   * unread messages from the chat, and updates the URL with the chat ID as a query string.
   * @param {ChatInterface} chat - The `chat` parameter is an object that represents a chat. It likely
   * has properties such as `id`, which is the unique identifier of the chat.
   * @returns The function does not explicitly return anything.
   */
  const setCurrentChat = (
    chat: ChatInterface,
    sidebarType?: "mobile" | "desktop",
  ) => {
    // Check if socket is available, if not, show an alert
    // if (!socketClient) {
    //   toast({
    //     description: "Socket not available! Try again by refreshing the page",
    //     variant: "warning",
    //   });
    //   return;
    // }

    if (sidebarType === "mobile") {
      toast({
        description:
          "Chat selected successfully. Close the modal and enjoy chatting with your favorite one",
        variant: "success",
      });
    }

    currentChatIdRef.current = chat.id; // store the current selected chat id

    setMessage("");

    // Emit an event to join the current chat
    // socketClient.emit(JOIN_CHAT_EVENT, chat.id);

    // Filter out unread messages from the current chat as those will be read
    setUnreadMessages((prevMsg) =>
      prevMsg.filter((msg) => msg.chatId !== chat.id),
    );

    router.replace(pathname + createQueryString("c", chat.id)); // store the current chat id in url as query string
  };

  // ----------------------------------------------------------------

  const { onHandleClickCreateChat, isChatCreating, isGroupChatCreating } =
    useOnHandleClickCreateChat();

  // --------------------------------------------------------------

  // automatically scroll down upon sending or receiving a message
  const [recentDate, setRecentDate] = useState(0);
  useLayoutEffect(() => {
    if (chatMsgContainerRef.current) {
      chatMsgContainerRef.current.scrollTop =
        chatMsgContainerRef.current.scrollHeight;
    }
  }, [recentDate]);

  // ----------------------------------------------------------------

  useEffect(() => {
    // If there's a current chat saved in local storage:
    if (searchParams.get("c")) {
      // Set the current chat reference to the one from local storage.
      currentChatIdRef.current = searchParams.get("c");

      // Filter out unread messages from the current chat as those will be read
      setUnreadMessages((prevMsg) =>
        prevMsg.filter((msg) => msg.chatId !== searchParams.get("c")),
      );
    }
  }, [searchParams]);

  // ----------------------------------------------------------------------

  // useEffect(() => {
  //   // If the socket isn't initialized, we don't set up listeners.
  //   if (!socketClient) return;

  //   // Listener for when the socket connects.
  //   socketClient.on(CONNECTED_EVENT, onConnect);
  //   // Listener for when the socket disconnects.
  //   socketClient.on(DISCONNECT_EVENT, onDisconnect);
  //   // Listener for when a user is typing.
  //   socketClient.on(TYPING_EVENT, onSocketTyping);
  //   // Listener for when a user stops typing.
  //   socketClient.on(STOP_TYPING_EVENT, onSocketStopTyping);
  //   // Listener for when a new message is received.
  //   // socketClient.on(MESSAGE_RECEIVED_EVENT, onMessageReceive);
  //   // Listener for the initiation of a new chat.
  //   // socketClient.on(NEW_CHAT_EVENT, onNewChat);
  //   // Listener for when a user leaves a chat.
  //   // socketClient.on(LEAVE_CHAT_EVENT, onChatLeave);
  //   // Listener for when a group's name is updated.
  //   // socketClient.on(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);

  //   return () => {
  //     // Remove all the event listeners we set up to avoid memory leaks and unintended behaviors.
  //     socketClient.off(CONNECTED_EVENT, onConnect);
  //     socketClient.off(DISCONNECT_EVENT, onDisconnect);
  //     socketClient.off(TYPING_EVENT, onSocketTyping);
  //     socketClient.off(STOP_TYPING_EVENT, onSocketStopTyping);
  //     // socketClient.off(MESSAGE_RECEIVED_EVENT, onMessageReceive);
  //     // socketClient.off(NEW_CHAT_EVENT, onNewChat);
  //     // socketClient.off(LEAVE_CHAT_EVENT, onChatLeave);
  //     // socketClient.off(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
  //   };
  // }, [socketClient, messages, chats]);

  // ---------------------------------------------------------------------

  useEffect(() => {
    if (status === "loading") return;
    pusherClient.subscribe((session.user as SessionUser).id);
    pusherClient.bind(MESSAGE_RECEIVED_EVENT, onMessageReceive);
    pusherClient.bind(NEW_CHAT_EVENT, onNewChat);
    pusherClient.bind(LEAVE_CHAT_EVENT, onChatLeave);
    pusherClient.bind(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);

    return () => {
      pusherClient.unsubscribe((session.user as SessionUser).id);
      pusherClient.unbind(MESSAGE_RECEIVED_EVENT, onMessageReceive);
      pusherClient.unbind(NEW_CHAT_EVENT, onNewChat);
      pusherClient.unbind(LEAVE_CHAT_EVENT, onChatLeave);
      pusherClient.unbind(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, messages, chats]);

  // useEffect(() => {
  //   if (status === "loading") return;
  //   const chatChannel = pusherClient.subscribe(
  //     (session.user as SessionUser).id,
  //   );
  //   chatChannel.bind(MESSAGE_RECEIVED_EVENT, onMessageReceive);

  //   return () => {
  //     pusherClient.unsubscribe((session.user as SessionUser).id);
  //     chatChannel.unbind(MESSAGE_RECEIVED_EVENT, onMessageReceive);
  //   };
  // }, [status, messages, chats, unreadMessages, currentChatIdRef]);

  return (
    <>
      <GroupChatDetailsModal
        onGroupDelete={(chatId) => {
          router.push(pathname + deleteQueryString("c", "cD"), {
            scroll: false,
          });
          if (currentChatIdRef.current === chatId) {
            currentChatIdRef.current = null;
          }
        }}
      />

      <div className="md:hidden">
        <MobileSidebar
          chats={chats.data}
          isChatsLoading={isChatsLoading}
          onHandleClickCreateChat={onHandleClickCreateChat}
          isChatCreating={isChatCreating}
          isGroupChatCreating={isGroupChatCreating}
          currentChatId={currentChatIdRef.current}
          setCurrentChat={(chat) => setCurrentChat(chat, "mobile")}
          unreadMessages={unreadMessages}
          onChatDelete={(chatId) => {
            if (currentChatIdRef.current === chatId) {
              currentChatIdRef.current = null;
              router.replace(pathname + deleteQueryString("c"));
            }
            toast({
              description: "Chat deleted successfully",
              variant: "success",
            });
          }}
        />
      </div>

      <div className="h-screen bg-primary-foreground md:py-4">
        <div className="mx-auto flex h-full max-w-[1200px] overflow-hidden rounded-lg border border-primary/20 bg-zinc-50 shadow">
          {/* ---------------
           `Sidebar` starts 
           ------------------*/}
          <div className="border-r border-r-primary/20 md:w-2/5">
            <>
              <Sidebar
                chats={chats.data}
                isChatsLoading={isChatsLoading}
                onHandleClickCreateChat={onHandleClickCreateChat}
                isChatCreating={isChatCreating}
                isGroupChatCreating={isGroupChatCreating}
                currentChatId={currentChatIdRef.current}
                setCurrentChat={setCurrentChat}
                unreadMessages={unreadMessages}
                onChatDelete={(chatId) => {
                  /* The above code is checking if the current chat ID (stored in the
                  `currentChatIdRef` variable) is equal to the `chatId` variable. If they are equal,
                  it sets the `currentChatIdRef` to `null` and replaces the current URL pathname
                  with a new pathname that does not include the query string parameter "c". */
                  if (currentChatIdRef.current === chatId) {
                    currentChatIdRef.current = null;
                    router.replace(pathname + deleteQueryString("c"));
                  }

                  toast({
                    description: "Chat deleted successfully",
                    variant: "success",
                  });
                }}
              />
            </>
          </div>
          {/* ---------------
           `Sidebar` ends 
           ------------------*/}

          <div className="relative flex w-full flex-col md:w-3/5">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-b-primary/20 px-4">
              {/* top left chat participant avatar starts */}
              <div className="flex w-max items-center justify-start gap-3">
                {currentChat ? (
                  <>
                    {currentChat.isGroupChat ? (
                      <div className="relative flex h-12 w-12 flex-shrink-0 flex-nowrap items-center justify-start">
                        {currentChat.participants
                          .slice(0, 3)
                          .map((participant, i) => {
                            return (
                              <Image
                                key={participant.id}
                                src={participant.avatar.url}
                                alt="chat participant image"
                                width={48}
                                height={48}
                                className={cn(
                                  "outline-dark absolute h-9 w-9 rounded-full border-[1px] border-white outline outline-4",
                                  i === 0
                                    ? "left-0 z-30"
                                    : i === 1
                                    ? "left-2 z-20"
                                    : i === 2
                                    ? "left-4 z-10"
                                    : "",
                                )}
                              />
                            );
                          })}
                      </div>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            getChatObjectMetadata(
                              currentChat,
                              session?.user as SessionUser,
                            ).avatar as string
                          }
                        />
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                    )}

                    <div>
                      <div className="font-semibold leading-4">
                        {
                          getChatObjectMetadata(
                            currentChat,
                            session?.user as SessionUser,
                          ).title as string
                        }
                      </div>

                      <div className="text-sm text-zinc-500">
                        {
                          getChatObjectMetadata(
                            currentChat,
                            session?.user as SessionUser,
                          ).description as string
                        }
                      </div>
                    </div>
                  </>
                ) : currentChatIdRef.current ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <div>
                      <Skeleton className="mb-1 h-4 w-20" />

                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ) : (
                  <div>No chat selected</div>
                )}
              </div>
              {/* top left chat participant avatar starts */}

              {/* hamburger menu */}
              <Button
                className="h-8 w-8 rounded-full p-1 md:hidden"
                onClick={toggleIsMobileSidebarOpen}
                variant="outline"
              >
                <Bars3Icon className="h-full w-full" />
              </Button>
              {/* ------------------ */}
            </div>

            {currentChat ? (
              <>
                <div
                  id="messageItemContainer"
                  ref={chatMsgContainerRef}
                  className={cn(
                    "flex h-full flex-col-reverse gap-[1px] overflow-y-auto p-4 ",
                  )}
                >
                  {messagesError ? (
                    <div className="grid h-full w-full place-items-center text-rose-400">
                      Something went wrong! Try again by refreshing the page
                    </div>
                  ) : isMessagesPending ? (
                    Array.from({ length: 20 }).map((_, index) => (
                      <MessageItemSkeleton
                        key={index}
                        isOwnMessage={!!(index % 2)}
                      />
                    ))
                  ) : (
                    <>
                      {/* {isTyping ? (
                        <div className="ml-8 text-sm text-zinc-500">
                          Typing...
                        </div>
                      ) : null} */}
                      {messages.data.map((msg: ChatMessageInterface, index) => (
                        <MessageItem
                          key={msg.id}
                          message={msg}
                          isOwnMessage={
                            msg.senderId === (session?.user as SessionUser)?.id
                          }
                          isGroupChatMessage={currentChat.isGroupChat}
                          isRecentMessage={
                            !!messages.data.length && index === 0
                          }
                          isMessageSendPending={isMessageSendPending}
                        />
                      ))}
                    </>
                  )}
                </div>

                {attachedFiles.length > 0 ? (
                  <div
                    className={cn(
                      "ml-auto grid w-fit gap-2 p-4 px-8",
                      attachedFiles.length === 1 ? " grid-cols-1" : "",
                      attachedFiles.length === 2 ? " grid-cols-2" : "",
                      attachedFiles.length >= 3 ? " grid-cols-3" : "",
                    )}
                  >
                    {attachedFiles.map((file, i) => {
                      return (
                        <div
                          key={i}
                          className="group relative isolate aspect-square h-32 w-32 cursor-pointer rounded-xl"
                        >
                          <Image
                            className="rounded-xl object-cover"
                            src={URL.createObjectURL(file)}
                            alt="attachment"
                            fill
                          />

                          <button
                            onClick={() => {
                              setAttachedFiles((files) =>
                                files.filter((_, ind) => ind !== i),
                              );
                            }}
                            className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-gray-700 p-[2px] text-white hover:bg-gray-800"
                          >
                            <XMarkIcon className="h-full w-full" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div className="sticky top-full mb-2  flex items-center  gap-3 px-4">
                  <div>
                    <input
                      hidden
                      id="attachments"
                      type="file"
                      value=""
                      multiple
                      max={5}
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files);
                          setAttachedFiles([...files]);
                        }
                      }}
                    />
                    <label
                      htmlFor="attachments"
                      className="mt-[2px] inline-block cursor-pointer rounded-full bg-primary/5 p-3 text-primary hover:bg-primary/10"
                    >
                      <PaperClipIcon className="h-6 w-6" />
                    </label>
                  </div>

                  <Input
                    value={message}
                    // onChange={handleOnMessageChange}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendChatMessage();
                        setRecentDate(Date.now());
                      }
                    }}
                    type="text"
                    placeholder="Type a message..."
                    className="rounded-full border-primary/40 px-4 text-base focus-visible:ring-primary"
                  ></Input>
                  <button
                    className="m-0 cursor-pointer rounded-full bg-primary/5 p-3 text-primary hover:bg-primary/10"
                    onClick={() => {
                      sendChatMessage();
                      setRecentDate(Date.now());
                    }}
                    disabled={
                      message.trim() === "" && attachedFiles.length <= 0
                    }
                  >
                    <PaperAirplaneIcon className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="text-lg font-semibold text-primary">
                  No chat selected
                </div>
                <p className="text-primary">
                  Select or add a partner and start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
