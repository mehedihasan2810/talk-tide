"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useStore } from "@/lib/stores/useStore";
import { SessionUser } from "@/types/session";

import {
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import SelectUser from "./SelectUser";
import SelectItem from "./SelectItem";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDeleteQueryString } from "../hooks/useDeleteQueryString";
import { useGetGroupInfo } from "../hooks/queries/useGetGroupInfo";
import { useDeleteGroupChat } from "../hooks/mutations/useDeleteGroupChat";
import { queryClient } from "@/contexts/providers";
import { useRenameGroup } from "../hooks/mutations/useRenameGroup";
import { useAddParticipant } from "../hooks/mutations/useAddParticipant";
import { useRemoveParticipant } from "../hooks/mutations/useRemoveParticipant";
import { ChatInterface } from "@/types/chat";
import { SuccessResponse } from "@/types/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLeaveGroupChat } from "../hooks/mutations/useLeaveGroupChat";

interface Props {
  onGroupDelete(_chatId: string): void;
}

const GroupChatDetailsModal: FC<Props> = ({ onGroupDelete }) => {
  const { isGroupDetailsModalOpen, toggleGroupDetailsModal } = useStore();

  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname();
  const { toast } = useToast();

  /**
   * get the user session or if the user is not authenticated
   * then redirect him to auth page
   */
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth");
    },
  });

  // State to manage the UI flag for adding a participant
  const [addingParticipant, setAddingParticipant] = useState(false);
  // State to manage the UI flag for renaming a group
  const [renamingGroup, setRenamingGroup] = useState(false);

  // State to capture the ID of the participant to be added
  const [participantToBeAdded, setParticipantToBeAdded] = useState("");

  // track the remove to be participant
  const [participantToBeRemoved, setParticipantToBeRemoved] = useState("");

  // State to capture the new name when renaming a group
  const [newGroupName, setNewGroupName] = useState("");

  // get the chat id from search params
  const chatId = searchParams.get("cD");

  const { mutate: addParticipantMutation, isPending: isAddPartPending } =
    useAddParticipant();

  const { mutate: removeParticipantMutation, isPending: isRemovePartPending } =
    useRemoveParticipant();

  const { mutate: deleteGroupChatMutation, isPending: isDeletingGroupChat } =
    useDeleteGroupChat();

  const { mutate: renameGroupMutation, isPending: isRenamePending } =
    useRenameGroup();

  const { mutate: leaveGroupChatMutation, isPending: isLeaveChatPending } =
    useLeaveGroupChat();

  // fetch the information of a specific group
  const { data: groupInfo, error } = useGetGroupInfo(chatId);

  // delete a specific query then return the remaining
  const deleteQueryString = useDeleteQueryString();

  const handleRemoveGroupParticipant = (
    participantId: string,
    groupChatId: string,
  ) => {
    // e.stopPropagation();

    setParticipantToBeRemoved(participantId);

    removeParticipantMutation(
      {
        chatId: groupChatId,
        participantToBeRemoved: participantId,
      },
      {
        onSuccess(newGroupInfo) {
          toast({
            description: "Participant removed successfully",
            variant: "success",
          });
          queryClient.setQueryData(["groupInfo"], newGroupInfo);
          queryClient.invalidateQueries({
            queryKey: ["groupInfo"],
          });
        },
        onError: (error) => {
          toast({
            title: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleLeaveGroupChat = (groupChatId: string) => {
    onGroupDelete(groupChatId);

    toggleGroupDetailsModal(false);

    leaveGroupChatMutation(groupChatId, {
      onSuccess() {
        onGroupDelete(groupChatId);

        toggleGroupDetailsModal(false);

        queryClient.setQueryData(
          ["chats"],
          (oldChats: SuccessResponse<ChatInterface[]>) => {
            return {
              ...oldChats,
              data: oldChats.data.filter((chat) => chat.id !== chatId),
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: ["chats"],
        });

        toast({
          description: "You left the group successfully",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });
  };

  useEffect(() => {
    if (!isGroupDetailsModalOpen && searchParams.get("cD")) {
      router.replace(pathname + deleteQueryString("cD"), {
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sheet open={isGroupDetailsModalOpen}>
      <SheetContent
        className="isolate w-full px-3 py-4 sm:max-w-[500px] sm:px-6 sm:py-8"
        side="left"
      >
        <button
          className="absolute right-3 top-3 z-10 ml-auto h-9 w-9 rounded-full border border-gray-300 p-1 text-gray-500 hover:border-gray-400 hover:text-gray-600"
          onClick={() => {
            toggleGroupDetailsModal(false);
            router.replace(pathname + deleteQueryString("cD"), {
              scroll: false,
            });
          }}
        >
          <XMarkIcon className="h-full w-full" />
        </button>

        {error ? (
          <div className="grid h-full w-full place-items-center text-rose-400">
            Something went wrong! Try again by refreshing the page
          </div>
        ) : !chatId || !groupInfo ? (
          <div className="flex h-full w-full items-center justify-center ">
            <ArrowPathIcon className="mr-2 inline-flex h-6 w-6 animate-spin items-center" />
          </div>
        ) : (
          <div className="relative flex-1">
            <div className="flex flex-col items-start justify-center">
              <div className="relative flex h-max w-full items-center justify-center gap-3 pl-16">
                {groupInfo.data.participants.slice(0, 3).map((p) => {
                  return (
                    <Image
                      className="-ml-14 h-16 w-16 rounded-full outline outline-4 outline-secondary sm:-ml-16 sm:h-24 sm:w-24"
                      key={p.id}
                      src={p.avatar.url}
                      alt="avatar"
                      width={96}
                      height={96}
                    />
                  );
                })}
                {groupInfo.data.participants &&
                groupInfo.data.participants.length > 3 ? (
                  <p>+{groupInfo.data.participants.length - 3}</p>
                ) : null}
              </div>
              <div className="flex w-full flex-col items-center justify-center text-center">
                {renamingGroup ? (
                  <div className="mt-5 flex w-full items-center justify-center gap-2">
                    <Input
                      placeholder="Enter new group name..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <Button
                      disabled={isRenamePending}
                      onClick={() => {
                        // Check if the new group name is provided.
                        if (!newGroupName) {
                          toast({
                            description: "Group name is required",
                            variant: "warning",
                          });
                          return;
                        }

                        renameGroupMutation(
                          { newGroupName, chatId },
                          {
                            onSuccess: (newGroupInfo) => {
                              setNewGroupName("");
                              setRenamingGroup(false);
                              queryClient.setQueryData(
                                ["groupInfo", chatId],
                                newGroupInfo,
                              );
                              queryClient.invalidateQueries({
                                queryKey: ["groupInfo", chatId],
                              });
                            },

                            onError: (error) => {
                              toast({
                                title: error.message,
                                variant: "destructive",
                              });
                            },
                          },
                        );
                      }}
                    >
                      {isRenamePending && (
                        <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save
                    </Button>
                    <Button onClick={() => setRenamingGroup(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="mt-5 inline-flex w-full items-center justify-center text-center">
                    <h1 className="max-w-[200px] truncate text-2xl font-semibold">
                      {groupInfo.data.name}
                    </h1>
                    {groupInfo.data.adminId ===
                    (session?.user as SessionUser)?.id ? (
                      <Button
                        className="ml-2 h-10 w-10 rounded-full bg-transparent p-2 text-black hover:bg-zinc-200 "
                        onClick={() => setRenamingGroup(true)}
                      >
                        <PencilIcon className="h-full w-full" />
                      </Button>
                    ) : null}
                  </div>
                )}

                <p className="mt-2 text-sm text-zinc-400">
                  Group · {groupInfo.data.participants.length} participants
                </p>
              </div>
              <Separator className="my-5" />
              <div className="w-full">
                <p className="inline-flex items-center">
                  <UserGroupIcon className="mr-2 h-6 w-6" />{" "}
                  {groupInfo.data.participants.length} Participants
                </p>
                <div className="w-full">
                  <div className="max-h-[40vh] overflow-y-auto pr-2">
                    {groupInfo.data.participants?.map((part) => {
                      return (
                        <React.Fragment key={part.id}>
                          <div className="flex w-full items-center justify-between py-4">
                            <div className="flex w-full items-start justify-start gap-3">
                              <Image
                                className="h-12 w-12 rounded-full"
                                src={part.avatar.url}
                                alt=""
                                width={48}
                                height={48}
                              />
                              <div>
                                <div className="inline-flex w-full items-center text-sm font-semibold">
                                  {part.username}{" "}
                                  {part.id === groupInfo.data.adminId ? (
                                    <Badge
                                      className="ml-1 bg-green-100"
                                      variant="secondary"
                                    >
                                      Admin
                                    </Badge>
                                  ) : null}
                                </div>
                                <small className="text-zinc-400">
                                  {part.email}
                                </small>
                              </div>
                            </div>
                            {/* {groupInfo.data.adminId ===
                            (session?.user as SessionUser)?.id ? ( */}
                            <div>
                              <Dialog>
                                {groupInfo.data.adminId ===
                                (session?.user as SessionUser)?.id
                                  ? (session?.user as SessionUser)?.id !==
                                      part.id && (
                                      <DialogTrigger
                                        className={buttonVariants({
                                          className:
                                            "border border-red-200 bg-transparent text-red-500 hover:bg-transparent hover:text-red-500 hover:opacity-70",
                                          size: "sm",
                                          variant: "destructive",
                                        })}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Remove
                                      </DialogTrigger>
                                    )
                                  : (session?.user as SessionUser)?.id ===
                                      part.id && (
                                      <DialogTrigger
                                        className={buttonVariants({
                                          className:
                                            "border border-red-200 bg-transparent text-red-500 hover:bg-transparent hover:text-red-500 hover:opacity-70",
                                          size: "sm",
                                          variant: "destructive",
                                        })}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Leave
                                      </DialogTrigger>
                                    )}

                                <DialogContent
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-center">
                                      {groupInfo.data.adminId ===
                                      (session?.user as SessionUser)?.id
                                        ? "Are you sure you want to remove this participant?"
                                        : "Are you sure you want to leave?"}
                                    </DialogTitle>
                                  </DialogHeader>

                                  <DialogFooter className="mx-auto">
                                    {groupInfo.data.adminId ===
                                    (session?.user as SessionUser)?.id ? (
                                      <Button
                                        disabled={
                                          participantToBeRemoved === part.id
                                            ? isRemovePartPending
                                            : false
                                        }
                                        onClick={(e) => {
                                          e.stopPropagation();

                                          handleRemoveGroupParticipant(
                                            part.id,
                                            chatId,
                                          );
                                        }}
                                        size="sm"
                                        variant="destructive"
                                      >
                                        {participantToBeRemoved === part.id &&
                                          isRemovePartPending && (
                                            <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                                          )}
                                        Remove
                                      </Button>
                                    ) : (
                                      <Button
                                        disabled={
                                          (session?.user as SessionUser)?.id ===
                                          part.id
                                            ? isLeaveChatPending
                                            : false
                                        }
                                        onClick={(e) => {
                                          e.stopPropagation();

                                          handleLeaveGroupChat(chatId);
                                        }}
                                        size="sm"
                                        variant="destructive"
                                      >
                                        {(session?.user as SessionUser)?.id ===
                                          part.id &&
                                          isLeaveChatPending && (
                                            <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                                          )}
                                        Leave
                                      </Button>
                                    )}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          <Separator />
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {groupInfo.data.adminId ===
                  (session?.user as SessionUser)?.id ? (
                    <div
                      className={cn(
                        "my-2 flex w-full items-center justify-center gap-2 sm:my-4 sm:gap-4",
                        addingParticipant && "flex-col",
                      )}
                    >
                      {!addingParticipant ? (
                        <Button
                          size="sm"
                          onClick={() => setAddingParticipant(true)}
                        >
                          <UserPlusIcon className="mr-1 h-5 w-5" /> Add
                          participant
                        </Button>
                      ) : (
                        <>
                          {participantToBeAdded && (
                            <SelectItem
                              onRemoveUser={() => {
                                setParticipantToBeAdded("");
                              }}
                              participantId={participantToBeAdded}
                            />
                          )}

                          <div className="flex w-full items-center justify-start gap-1">
                            <SelectUser
                              onHandleSelect={(participantId) => {
                                setParticipantToBeAdded(participantId);
                              }}
                            />

                            <Button
                              disabled={isAddPartPending}
                              onClick={() => {
                                // Check if there's a participant selected to be added.
                                if (!participantToBeAdded) {
                                  toast({
                                    description:
                                      "Please select a participant to add",
                                    variant: "warning",
                                  });
                                  return;
                                }

                                addParticipantMutation(
                                  {
                                    chatId,
                                    participantToBeAdded,
                                  },
                                  {
                                    onSuccess: (newGroupInfo) => {
                                      setParticipantToBeAdded("");
                                      queryClient.setQueryData(
                                        ["groupInfo"],
                                        newGroupInfo,
                                      );
                                      queryClient.invalidateQueries({
                                        queryKey: ["groupInfo"],
                                      });
                                    },
                                    onError: (error) => {
                                      toast({
                                        title: error.message,
                                        variant: "destructive",
                                      });
                                    },
                                  },
                                );
                              }}
                            >
                              {isAddPartPending && (
                                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              + Add
                            </Button>
                            <Button
                              onClick={() => {
                                setAddingParticipant(false);
                                setParticipantToBeAdded("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      )}

                      <Dialog>
                        <DialogTrigger
                          className={buttonVariants({
                            variant: "destructive",
                            className: "inline-flex items-center",
                            size: "sm",
                          })}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <TrashIcon className="mr-1 h-5 w-5" /> Delete group
                        </DialogTrigger>
                        <DialogContent onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              Are you sure you want to delete this chat?
                            </DialogTitle>
                          </DialogHeader>

                          <DialogFooter className="mx-auto">
                            <Button
                              disabled={isDeletingGroupChat}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check if the user is the admin of the group before deletion.
                                if (
                                  groupInfo.data.adminId !==
                                  (session?.user as SessionUser)?.id
                                ) {
                                  toast({
                                    description:
                                      "You can not delete this chat as you are not the admin of this group",
                                    variant: "warning",
                                  });
                                  return;
                                }

                                deleteGroupChatMutation(chatId, {
                                  onSuccess: () => {
                                    onGroupDelete(chatId);
                                    toggleGroupDetailsModal(false);
                                    queryClient.setQueryData(
                                      ["chats"],
                                      (
                                        oldChats: SuccessResponse<
                                          ChatInterface[]
                                        >,
                                      ) => {
                                        return {
                                          ...oldChats,
                                          data: oldChats.data.filter(
                                            (chat) => chat.id !== chatId,
                                          ),
                                        };
                                      },
                                    );
                                    queryClient.invalidateQueries({
                                      queryKey: ["chats"],
                                    });
                                    toast({
                                      description:
                                        "Deleted group chat successfully",
                                      variant: "success",
                                    });
                                  },

                                  onError: (error) => {
                                    toast({
                                      title: error.message,
                                      variant: "destructive",
                                    });
                                  },
                                });
                              }}
                              size="sm"
                              variant="destructive"
                            >
                              {isDeletingGroupChat && (
                                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default GroupChatDetailsModal;
