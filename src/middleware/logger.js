import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs, { promises as fsPromises } from "fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import path from "path";

const currDate = `${format(new Date(), "yyyyMMdd")}`.toString();

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  const __dirname = dirname(fileURLToPath(import.meta.url));

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, `${currDate}_reqLog.log`);
  next();
};

export { logEvents, logger };
