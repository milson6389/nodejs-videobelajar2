import multer from "multer";
import path from "path";
import util from "util";
import dotenv from "dotenv";
import fs, { promises as fsPromises } from "fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "date-fns";

dotenv.config();

const fileSizeConfig = process.env.FILE_UPLOAD_MAX_SIZE || 5;
const maxSize = parseInt(fileSizeConfig) * 1024 * 1024;
const __dirname = dirname(fileURLToPath(import.meta.url));
const currDate = `${format(new Date(), "yyyyMMdd")}`.toString();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.join(__dirname, "..", "public", "uploads"))) {
      fs.mkdirSync(path.join(__dirname, "..", "public", "uploads"), { recursive: true });
    }
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${currDate}_${file.originalname}`);
  },
});

const uploadFile = multer({
  storage: diskStorage,
  limits: { fileSize: maxSize },
  onError: function (err, next) {
    next(err);
  },
}).single("file");

const uploadHandler = util.promisify(uploadFile);

export { uploadHandler };
