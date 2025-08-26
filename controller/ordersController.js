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
router.get("/customer", getOrdersByCustomer);
router.get("/shop", getOrdersByShop);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.put("/:id/payment-status", updatePaymentStatus);
router.put("/:id/delivery-date-status", updateDeliveryDateAndStatus);

export default router;
