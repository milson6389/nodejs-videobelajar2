import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import userController from "../controller/userController.js";

const userRouter = new express.Router();
userRouter
  .route("/api/v1/user")
  .post(userController.registerUser)
  .get(protect, userController.getUserInfo)
  .put(protect, userController.updateUserInfo);
userRouter.route("/api/v1/user/auth").post(userController.userLogin);
userRouter.route("/api/v1/user/logout").post(protect, userController.userLogout);
userRouter.route("/api/v1/user/verify-email").post(protect, userController.getToken);
userRouter.route("/api/v1/user/verify-token").post(protect, userController.verifyToken);
userRouter.route("/api/v1/user/verify-token/:token").get(protect, userController.verifyTokenByParameters);

export { userRouter };
