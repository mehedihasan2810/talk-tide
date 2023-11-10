// This utility function generates metadata for chat objects.

import { ChatListItemInterface } from "@/types/chat";
import { SessionUser } from "@/types/types";
// import { UserInterface } from "@/types/user";

// It takes into consideration both group chats and individual chats.
export const getChatObjectMetadata = (
  chat: ChatListItemInterface, // The chat item for which metadata is being generated.
  loggedInUser: SessionUser, // The currently logged-in user details.
) => {
  // Determine the content of the last message, if any.
  // If the last message contains only attachments, indicate their count.
  const lastMessage = chat.chatMessages[0]?.content
    ? chat.chatMessages[0]?.content
    : chat.chatMessages[0]
    ? `${chat.chatMessages[0]?.attachments?.length} attachment${
        chat.chatMessages[0].attachments.length > 1 ? "s" : ""
      }`
    : "No messages yet"; // Placeholder text if there are no messages.

  if (chat.isGroupChat) {
    // Case: Group chat
    // Return metadata specific to group chats.
    return {
      // Default avatar for group chats.
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name, // Group name serves as the title.
      description: `${chat.participants.length} members in the chat`, // Description indicates the number of members.
      lastMessage: chat.chatMessages[0]
        ? chat.chatMessages[0]?.sender?.username + ": " + lastMessage
        : lastMessage,
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
