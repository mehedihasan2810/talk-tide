import { SuccessResponse } from "@/types/api";
import { ChatInterface, ChatMessageInterface } from "@/types/chat";
import { SessionUser } from "@/types/types";
import { STOP_TYPING_EVENT } from "../../constants";
import { queryClient } from "@/contexts/providers";
import { useSendMessage } from "../mutations/useSendMessage";
import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { Session } from "next-auth";
import { useUpdateChatLastMessage } from "../socket-event-handlers/useUpdateChatLastMessage";
import { useToast } from "@/components/ui/use-toast";

type UseSendChatMessage = (
  _currentChatIdRef: MutableRefObject<string | null>,
  _socketClient: Socket | null,
  _session: Session | null,
  _message: string,
  _attachedFiles: File[],
  _setMessage: (_message: string) => void,
  _setAttachedFiles: (_file: File[]) => void,
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
  socketClient,
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
    if (!currentChatIdRef.current || !socketClient || !session) return;

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
          url: "https://via.placeholder.com/200x200.png",
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

    // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
    socketClient.emit(STOP_TYPING_EVENT, currentChatIdRef.current);

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
      { chatId: currentChatIdRef.current, formData },

      {
        onError: () => {
          toast({
            description:
              "Something went wrong! Try again by refreshing the page",
            variant: "destructive",
          });
          queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
      },
    );
  };

  return { sendChatMessage, isMessageSendPending };
};
