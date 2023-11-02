import prisma from "../../src/lib/prisma";
import { seedOneOnOneChats } from "./OneOnOneChat.seed";
import { seedGroupChat } from "./groupChat.seed";

const seedChatApp = async () => {
  await prisma.chat.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await seedOneOnOneChats();
  await seedGroupChat();
};

export { seedChatApp };
