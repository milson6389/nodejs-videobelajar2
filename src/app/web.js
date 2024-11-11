import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { corsOptions } from "../config/corsOptions.js";
import { errorMiddleware } from "../middleware/errorMiddleware.js";
import { logger } from "../middleware/logger.js";
import { userRouter } from "../routes/userApi.js";
import { tutorRouter } from "../routes/tutorApi.js";
import { categoryRouter } from "../routes/categoryApi.js";
import { productRouter } from "../routes/productApi.js";
import { assetRouter } from "../routes/assetApi.js";

dotenv.config();

BigInt.prototype.toJSON = function () {
  return Number(this.toString());
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export const web = express();
web.use(logger);
web.use(cors(corsOptions));
web.use(cookieParser());
web.use(express.urlencoded({ extended: true }));
web.use(express.json());
web.get("/", (req, res) => {
  res.send("OK!");
});
web.use(userRouter);
web.use(tutorRouter);
web.use(categoryRouter);
web.use(productRouter);
web.use(assetRouter);
web.use("/api/v1/asset/img", express.static(path.join(__dirname, "../public/uploads")));
web.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});
web.use(errorMiddleware);
