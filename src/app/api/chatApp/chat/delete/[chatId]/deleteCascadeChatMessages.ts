import prisma from "@/lib/prisma";
import { removeLocalFile } from "@/utils/helpers/removeLocalFile";

interface Attachments {
  url: string;
  localPath: string;
}

export const deleteCascadeChatMessages = async (chatId: string) => {
  // fetch the messages associated with the chat to remove
  const messages = await prisma.chatMessage.findMany({
    where: {
      chatId,
    },
  });

  let attachments: Attachments[] = [];

  // get the attachments present in the messages
  attachments = attachments.concat(
    ...messages.map((message) => {
      return message.attachments;
    }),
  );
  //   ------------------------------------------

  attachments.forEach((attachment) => {
    // remove attachment files from the local storage
    removeLocalFile(attachment.localPath);
  });

  // delete all the messages ------------
  await prisma.chatMessage.deleteMany({
    where: {
      chatId,
    },
  });
  //   -----------------------------------
};