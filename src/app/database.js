import { PrismaClient } from "@prisma/client";
import { logEvents } from "../middleware/logger.js";
import { format } from "date-fns";
import dotenv from "dotenv";

dotenv.config();
const currDate = `${format(new Date(), "yyyyMMdd")}`.toString();

export const prismaClient = new PrismaClient({
  errorFormat: "pretty",
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("error", (e) => {
  logEvents(JSON.stringify(e), `${currDate}_errDbLog.log`);
});
prismaClient.$on("warn", (e) => {
  logEvents(JSON.stringify(e), `${currDate}_warnDbLog.log`);
});
prismaClient.$on("info", (e) => {
  if (process.env.NODE_ENV == "development") {
    logEvents(JSON.stringify(e), `${currDate}_dbLog.log`);
  }
});
prismaClient.$on("query", (e) => {
  if (process.env.NODE_ENV == "development") {
    logEvents(JSON.stringify(e), `${currDate}_queryLog.log`);
  }
});
