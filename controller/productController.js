import express from "express";
import { 
  createProduct,
  getProductsByShopOwnerId,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts
 } from "../service/productService.js";

const router = express.Router();

router.post("/create", createProduct);
router.get("/shop/:shopOwnerId", getProductsByShopOwnerId);
router.get("/:productId", getProductById);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);
router.get("/", getAllProducts);

export default router;