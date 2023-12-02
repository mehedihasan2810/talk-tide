import chalk from "chalk";
import { seedUsers } from "./users.seed";
import prisma from "../../src/lib/prisma";
// import { seedChatApp } from "./chatApp.seed";

const log = console.log;

export async function main() {
  try {
    log(chalk.bold.green("Start Seeding..."));

    // seed users ----
    await seedUsers();
    // ---------------

    // ----------------
    // await seedChatApp();
    // -----------------

    log(chalk.bold.green("Seeding finished"));
  } catch (err) {
    log(chalk.bold.red(err));
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
