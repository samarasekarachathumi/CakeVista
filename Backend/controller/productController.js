import express from "express";
import { 
  createProduct,
  getProductsByShopOwnerId,
  getProductsByShopOwner,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getLeastAddedProducts
 } from "../service/productService.js";

const router = express.Router();

router.post("/create", createProduct);
router.get("/manage", getProductsByShopOwner);
router.get("/all", getAllProducts);
router.get("/least-added", getLeastAddedProducts);
router.get("/shop/:shopOwnerId", getProductsByShopOwnerId);
router.get("/:productId", getProductById);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;