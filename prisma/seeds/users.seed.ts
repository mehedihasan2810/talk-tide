import { faker } from "@faker-js/faker";
import { AvailableUserRoles, USER_COUNT } from "./_constants";
import { getRandomNumber } from "../../src/utils/helpers/getRandomNumber";
import chalk from "chalk";
import prisma from "../../src/lib/prisma";

const log = console.log;

// list of fake users
const users = Array.from({ length: USER_COUNT }).map(() => ({
  avatar: {
    url: faker.internet.avatar(),
    localPath: "",
  },
  username: faker.internet.userName().toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
  isEmailVerified: true,
  role: AvailableUserRoles[getRandomNumber(2)],
}));
// -------------------------------------------------

const seedUsers = async () => {
  try {
    const userCount = await prisma.user.count();

    // Don't re-generate the users if we already have them in the database
    if (userCount >= USER_COUNT) {
      log(chalk.bold.green("users already there in db no need seeding"));

      return;
    }
    // -----------------------------------------------

    //   delete existing data before seeding
    await prisma.user.deleteMany({});
    //   -------------------------------

    // create Promise list ---------
    const userCreationPromise = users.map(async (user) => {
      await prisma.user.create({
        data: user,
      });
    });
    //   ----------------------------

    // pass promises array to the Promise.all method
    await Promise.all(userCreationPromise);
    // -------------------------------------------

    log(chalk.bold.green("succesfully completed seeding for users"));
  } catch (error) {
    log(chalk.bold.red((error as Error).message));
    throw new Error((error as Error).message);
  }
};

export { seedUsers };
