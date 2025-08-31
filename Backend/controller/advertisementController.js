import express from "express";

import {
  createAdvertisement,
  getAllAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisementByShop,
  getActiveAdvertisement
} from "../service/advertisementService.js";

const router = express.Router();

router.post("/", createAdvertisement);
router.get("/", getAllAdvertisements);
router.get("/shop/", getAdvertisementByShop);
router.patch("/:id", updateAdvertisement);
router.delete("/:id", deleteAdvertisement);
router.get("/active/:adPosition", getActiveAdvertisement);

export default router;
