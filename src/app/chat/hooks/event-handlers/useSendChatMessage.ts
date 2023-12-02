import { SuccessResponse } from "@/types/api";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";
import { SessionUser } from "@/types/session";
import { queryClient } from "@/contexts/providers";
import { useSendMessage } from "../mutations/useSendMessage";
import { MutableRefObject } from "react";
import { Session } from "next-auth";
import { useUpdateChatLastMessage } from "../pusher-event-handlers/useUpdateChatLastMessage";
import { useToast } from "@/components/ui/use-toast";

type UseSendChatMessage = (
  _currentChatIdRef: MutableRefObject<string | null>,
  _session: Session | null,
  _message: string,
  _attachedFiles: any[],
  _setMessage: (_message: string) => void,
  _setAttachedFiles: (_file: any[]) => void,
  _chats:
    | SuccessResponse<ChatInterface[]>
    | {
        data: never[];
      },
) => {
  sendChatMessage: () => Promise<void>;
  isMessageSendPending: boolean;
};

export const useSendChatMessage: UseSendChatMessage = (
  currentChatIdRef,
  session,
  message,
  attachedFiles,
  setMessage,
  setAttachedFiles,
  chats,
) => {
  const { toast } = useToast();

  const updateChatLastMessage = useUpdateChatLastMessage(chats);
  const { mutate: sendMessageMutation, isPending: isMessageSendPending } =
    useSendMessage();

  // Function to send a chat message
  const sendChatMessage = async () => {
    // If no current chat ID exists or there's no socket connection, exit the function
    if (!currentChatIdRef.current || !session) return;

    const { email, name } = session.user as SessionUser;

    const tempAttachments = attachedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      localPath: "",
    }));

    const newMessage: ChatMessageInterface = {
      id: crypto.randomUUID(),
      content: message,
      senderId: (session?.user as SessionUser)?.id,
      sender: {
        id: crypto.randomUUID(),
        email: email as string,
        username: name as string,
        avatar: {
          url: "",
          localPath: "",
        },
      },
      chatId: currentChatIdRef.current,
      attachments: tempAttachments,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData(
      ["messages", currentChatIdRef.current],
      (oldMessages: SuccessResponse<ChatMessageInterface[]>) => {
        return {
          ...oldMessages,
          data: [newMessage, ...oldMessages.data],
        };
      },
    );

    const formData = new FormData();

    if (message) {
      formData.append("content", message);
    }

    attachedFiles.map((file) => {
      formData.append("attachments", file);
    });

    setMessage(""); // Clear the message input
    setAttachedFiles([]); // Clear the list of attached files

    // Update the last message for the chat to which the received message belongs
    updateChatLastMessage(currentChatIdRef.current || "", newMessage);

    sendMessageMutation(
      {
        chatId: currentChatIdRef.current,
        formData,
      },

      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["messages", currentChatIdRef.current],
          });
        },
        onError: (error) => {
          toast({
            title: error.message,
            variant: "destructive",
          });
          queryClient.invalidateQueries({
            queryKey: ["messages", currentChatIdRef.current],
          });
        },
      },
    );
  };

  return { sendChatMessage, isMessageSendPending };
};
