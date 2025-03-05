import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Optional: Test the connection by running a simple query
(async () => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log("Connected to DB at:", result[0].now);
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
})();

// Optional: Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
