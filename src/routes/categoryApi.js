import express from "express";
import categoryController from "../controller/categoryController.js";

const categoryRouter = new express.Router();
categoryRouter.route("/api/v1/category").get(categoryController.getAllCategory).post(categoryController.addCategory);
categoryRouter
  .route("/api/v1/category/:id")
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export { categoryRouter };
