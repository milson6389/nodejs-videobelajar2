import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prismaClient } from "../app/database.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    res
      .status(401)
      .json({
        errors: "UnAuthorized",
      })
      .end();
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userExists = await prismaClient.user.findFirst({
      where: {
        userId: decoded.userId,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        noHp: true,
        profilePicture: true,
        isVerified: true,
      },
    });
    if (!userExists) {
      res
        .status(401)
        .json({
          errors: "UnAuthorized",
        })
        .end();
    } else {
      req.user = userExists;
      next();
    }
  }
};
