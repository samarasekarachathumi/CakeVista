import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByShop,
  updateOrderStatus,
  deleteOrder,
  updatePaymentStatus,
  updateDeliveryDateAndStatus
} from "../service/ordersService.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/customer/:customer_id", getOrdersByCustomer);
router.get("/shop/:shop_id", getOrdersByShop);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.put("/:id/payment-status", updatePaymentStatus);
router.put("/:id/delivery-date-status", updateDeliveryDateAndStatus);

export default router;
