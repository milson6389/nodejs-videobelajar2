import express from "express";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import productController from "../controller/productController.js";

const productRouter = express.Router();
productRouter
  .route("/api/v1/product")
  .get(productController.getProductList)
  .post(protect, productController.addProduct);
productRouter
  .route("/api/v1/product/:id")
  .get(productController.getProductById)
  .put(protect, productController.updateProduct)
  .delete(protect, productController.deleteProduct);

export { productRouter };
