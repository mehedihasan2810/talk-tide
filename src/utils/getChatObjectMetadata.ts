// This utility function generates metadata for chat objects.

import { ChatInterface } from "@/types/chat";
import { SessionUser } from "@/types/session";

// It takes into consideration both group chats and individual chats.
export const getChatObjectMetadata = (
  chat: ChatInterface, // The chat item for which metadata is being generated.
  loggedInUser: SessionUser, // The currently logged-in user details.
) => {
  // Determine the content of the last message, if any.
  // If the last message contains only attachments, indicate their count.
  const chatMessages = chat.chatMessages[0];
  const lastMessage = chatMessages?.content
    ? `${
        chatMessages?.senderId === loggedInUser?.id
          ? "You"
          : chatMessages?.sender?.username
      }: ${chatMessages?.content}`
    : chatMessages?.attachments?.length
    ? `${chatMessages?.attachments?.length} attachment${
        chatMessages?.attachments?.length > 1 ? "s" : ""
      }`
    : "No messages yet";

  if (chat.isGroupChat) {
    // Case: Group chat
    // Return metadata specific to group chats.
    return {
      // Default avatar for group chats.
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name, // Group name serves as the title.
      description: `${chat.participants.length} members in the chat`, // Description indicates the number of members.
      lastMessage,
    };
  } else {
    // Case: Individual chat
    // Identify the participant other than the logged-in user.
    const participant = chat.participants.find(
      (p) => p.id !== loggedInUser?.id,
    );
    // Return metadata specific to individual chats.
    return {
      avatar: participant?.avatar.url, // Participant's avatar URL.
      title: participant?.username, // Participant's username serves as the title.
      description: participant?.email, // Email address of the participant.
      lastMessage,
    };
  }
};
