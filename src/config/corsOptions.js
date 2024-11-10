import dotenv from "dotenv";

dotenv.config();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",") || [];

export const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};
