import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import tutorController from "../controller/tutorController.js";

const tutorRouter = new express.Router();
tutorRouter
  .route("/api/v1/tutor")
  .get(tutorController.getListTutor)
  .post(protect, tutorController.registerTutor)
  .put(protect, tutorController.updateTutor);
tutorRouter.route("/api/v1/tutor/:id").get(tutorController.getTutorById);

export { tutorRouter };
