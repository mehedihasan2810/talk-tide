import { useToast } from "@/components/ui/use-toast";
import { SuccessResponse } from "@/types/api";
import { ChatInterface } from "@/types/chat";
import { OnHandleClickCreateChatType } from "../../types";
import { queryClient } from "@/contexts/providers";
import { useCreateNewChat } from "../mutations/useCreateNewChat";
import { useCreateNewGroupChat } from "../mutations/useCreateNewGroupChat";

const useOnHandleClickCreateChat = () => {
  const { toast } = useToast();
  const { mutate: createChatMutation, isPending: isChatCreating } =
    useCreateNewChat(); // create one to one chat mutation

  const { mutate: createGroupChatMutation, isPending: isGroupChatCreating } =
    useCreateNewGroupChat(); // group chat create mutation

  const onHandleClickCreateChat: OnHandleClickCreateChatType = (
    isGroupChat,
    groupName,
    groupParticipants,
    participant,
    setGroupName,
    setGroupParticipants,
    setParticipant,
  ) => {
    if (isGroupChat) {
      // Check if a group name is provided
      if (!groupName) {
        toast({ description: "Group name required", variant: "warning" });
        return;
      }

      // Ensure there are at least 2 group participants
      if (!groupParticipants.length || groupParticipants.length < 2) {
        toast({
          description: "There must be at least 2 group participants",
          variant: "warning",
        });
        return;
      }

      /* The below code is performing a mutation called `createGroupChatMutation` to create a new group
        chat. It takes two parameters: `groupName` and `participantIds`. */
      createGroupChatMutation(
        {
          groupName,
          participantIds: groupParticipants,
        },
        {
          onSuccess: (newChat) => {
            // reset the states onSuccess
            setGroupName();
            setGroupParticipants();

            // update the cache
            queryClient.setQueryData(
              ["chats"],
              (oldChats: SuccessResponse<ChatInterface[]>) => {
                return {
                  ...oldChats,
                  data: [newChat.data, ...oldChats.data],
                };
              },
            );

            toast({
              description: "Group chat created successfully",
              variant: "success",
            });

            // invalidate the chat list
            queryClient.invalidateQueries({
              queryKey: ["chats"],
            });
          },
          onError: (error) => {
            toast({ description: error.message, variant: "destructive" });
          },
        },
      );
    }

    if (!isGroupChat) {
      if (!participant) {
        toast({
          description: "Please select a participant",
          variant: "warning",
        });
        return;
      }

      /* The above code is a mutation function that creates a new chat. It takes a participant as a
         parameter and has an onSuccess callback function. */
      createChatMutation(participant, {
        onSuccess: (newChat) => {
          setParticipant();
          queryClient.setQueryData(
            ["chats"],
            (oldChats: SuccessResponse<ChatInterface[]>) => {
              return {
                ...oldChats,
                data: [newChat.data, ...oldChats.data],
              };
            },
          );

          toast({
            description: "Chat created successfully",
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
        onError: (error) => {
          toast({ description: error.message, variant: "destructive" });
        },
      });
    }
  };

  return { onHandleClickCreateChat, isChatCreating, isGroupChatCreating };
};

export default useOnHandleClickCreateChat;
