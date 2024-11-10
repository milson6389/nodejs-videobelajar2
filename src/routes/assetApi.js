import express from "express";
import assetController from "../controller/assetController.js";

const assetRouter = new express.Router();
assetRouter.route("/api/v1/upload").post(assetController.uploadFile);
assetRouter.route("/api/v1/delete").delete(assetController.deleteFile);

export { assetRouter };
