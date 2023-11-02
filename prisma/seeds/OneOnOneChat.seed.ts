import { getRandomNumber } from "../../src/utils/helpers/getRandomNumber";
import prisma from "../../src/lib/prisma";
import chalk from "chalk";
import { ONE_ON_ONE_CHATS_COUNT } from "./_constants";

const seedOneOnOneChats = async () => {
  try {
    // retrieve all existing users
    const users = await prisma.user.findMany({});
    //   ----------------------------------------

    //   make a list of promise array
    const chatsArray = Array.from({ length: ONE_ON_ONE_CHATS_COUNT }).map(
      async () => {
        // --------------------------------------
        let index1 = getRandomNumber(users.length);
        let index2 = getRandomNumber(users.length);

        if (index1 === index2) {
          // This shows that both participant indexes are the same
          index2 <= 0 ? index2++ : index2--; // avoid same participants
        }

        const participantIds = [users[index1].id, users[index2].id];

        const chatData = {
          name: "One on one chat",
          isGroupChat: false,
          participantIds,
          adminId: participantIds[getRandomNumber(participantIds.length)],
        };

        // first check if participants exist
        const chat = await prisma.chat.findFirst({
          where: {
            AND: [
              {
                participantIds: {
                  has: participantIds[0],
                },
              },
              {
                participantIds: {
                  has: participantIds[1],
                },
              },
            ],
          },
        });

        // if then avoid duplicating
        if (chat) return;

        // otherwise create
        await prisma.chat.create({
          data: chatData,
        });
        // ---------------------------------
      }
    );

    //   make sure all the creation req resolves succesfully
    await Promise.all(chatsArray);
    //   -------------------------------------

    console.log(
      chalk.bold.green("Seeding for chat collection completed successfully")
    );
  } catch (error) {
    console.log(chalk.bold.red((error as Error).message));
    throw new Error((error as Error).message);
  }
};

export { seedOneOnOneChats };
