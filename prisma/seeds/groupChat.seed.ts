import { getRandomNumber } from "../../src/utils/helpers/getRandomNumber";
import prisma from "../../src/lib/prisma";
import chalk from "chalk";
import {
  GROUP_CHATS_COUNT,
  GROUP_CHAT_MAX_PARTICIPANTS_COUNT,
} from "./_constants";
import { faker } from "@faker-js/faker";

const seedGroupChat = async () => {
  try {
    // ---------------------------------------
    const users = await prisma.user.findMany({});

    const groupChatArray = Array.from({ length: GROUP_CHATS_COUNT }).map(() => {
      // -----------------------------
      let participantIds: string[] = [];

      // random participant count -------------
      const participantsCount = getRandomNumber(
        GROUP_CHAT_MAX_PARTICIPANTS_COUNT
      );
      // -----------------------------------------

      // take users as group chat participant randomly --------
      Array.from({
        length: participantsCount < 3 ? 3 : participantsCount,
      }).forEach(() => {
        participantIds.push(users[getRandomNumber(users.length)].id);
      });
      // ---------------------------------------------------------

      // participants should be unique no duplicate --------
      participantIds = Array.from(new Set(participantIds));

      // ----------------------------------------------------

      return {
        name: faker.vehicle.vehicle() + faker.company.buzzNoun(),
        isGroupChat: true,
        participantIds,
        adminId: participantIds[getRandomNumber(participantIds.length)],
      };
    });

    //  insert fake group chat data into db
    await prisma.chat.createMany({
      data: groupChatArray,
    });
    //   -------------------------------------

    console.log(
      chalk.bold.green("seeding completed successfully for group chat ")
    );
  } catch (error) {
    console.log(chalk.bold.red((error as Error).message));
    throw new Error((error as Error).message);
  }
};

export { seedGroupChat };
