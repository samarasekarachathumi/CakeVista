import express from "express";

import {
  createAdvertisement,
  getAllAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  updateAdvertisementStatus,
  updateIsActiveAdvertisement,
  updateIsActiveStatus,
  getAdvertisementByShop
} from "../service/advertisementService.js";

const router = express.Router();

router.post("/", createAdvertisement);
router.get("/", getAllAdvertisements);
router.get("/shop/:shopOwnerId", getAdvertisementByShop);
router.put("/:id", updateAdvertisement);
router.delete("/:id", deleteAdvertisement);
router.patch("/:id/status", updateAdvertisementStatus);
router.patch("/:id/active", updateIsActiveAdvertisement);
router.patch("/:id/active-status", updateIsActiveStatus);

export default router;
