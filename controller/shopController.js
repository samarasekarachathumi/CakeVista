import express from 'express';
import { 
  getAllShopOwners, 
  updateShopStatus, 
  getActiveShops, 
  getShopDetailsShopOwnerId, 
  updateShopDetails,
  getProductsByShopOwnerId,
} from '../service/shopService.js';

const shopController = express.Router();

shopController.get("/all", getAllShopOwners);
shopController.patch("/status/:id", updateShopStatus);
shopController.get("/active", getActiveShops);
shopController.get("/owner", getShopDetailsShopOwnerId);
shopController.patch("/owner/:id", updateShopDetails);
shopController.get("/owner/:id/products", getProductsByShopOwnerId);


export default shopController;