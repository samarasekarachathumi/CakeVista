import Advertisement from "../modals/advertisement/advertisement.js";
import ShopOwner from "../modals/users/ShopOwner.js";
import { isShopOwner, isAdmin, getShopOwnerByReq } from "./userService.js";

export const createAdvertisement = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can create advertisements.",
    });
  }
  try {
    const {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      adPosition,
      price,
      paymentStatus,
      paymentMethod,
    } = req.body;

    const shopOwner = await getShopOwnerByReq(req);
    const advertisement = new Advertisement({
      shopOwnerId: shopOwner._id,
      title,
      description,
      imageUrl,
      startDate,
      price,
      endDate,
      paymentMethod,
      adPosition: adPosition || "top",
      paymentStatus: paymentStatus || "pending",
      isActive: false,
    });

    const createdAdvertisement = await advertisement.save();

    return res.status(201).json({
      success: true,
      message: "Advertisement created successfully.",
      data: createdAdvertisement,
    });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not create advertisement.",
      error: error.message,
    });
  }
};

export const getAllAdvertisements = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can manage advertisements.",
    });
  }
  try {
    const advertisements = await Advertisement.find();
    const shopDetails = await ShopOwner.find({
      _id: { $in: advertisements.map((ad) => ad.shopOwnerId) },
    });

    const shopMap = {};
    shopDetails.forEach((shop) => {
      shopMap[shop._id] = shop;
    });

    const adsWithShopDetails = advertisements.map((ad) => ({
      ...ad.toObject(),
      shopDetails: shopMap[ad.shopOwnerId] || null,
    }));

    return res.status(200).json({
      success: true,
      message: "Advertisements fetched successfully.",
      data: adsWithShopDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch advertisements",
      error: err.message,
    });
  }
};

export const getAdvertisementByShop = async (req, res) => {
  try {
    const shopOwner = await getShopOwnerByReq(req);
    const advertisements = await Advertisement.find({
      shopOwnerId: shopOwner._id,
    });
    return res.status(200).json({
      success: true,
      message: "Advertisements fetched successfully.",
      data: advertisements,
    });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve advertisements.",
      error: error.message,
    });
  }
};

export const updateAdvertisement = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can update advertisements.",
    });
  }
  try {
    const patchedAdvertisement = await Advertisement.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!patchedAdvertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement patched successfully.",
      data: patchedAdvertisement,
    });
  } catch (error) {
    console.error("Error patching advertisement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not patch advertisement.",
      error: error.message,
    });
  }
};

export const deleteAdvertisement = async (req, res) => {
  const { id } = req.params;
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can delete advertisements.",
    }); 
  }
  try {
    await Advertisement.findByIdAndDelete(
      { _id: id }
    );
    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not delete advertisement.",
      error: error.message,
    });
  }
};

export const getActiveAdvertisement = async (req, res) => {
  const { adPosition } = req.params;
  try {
    const activeAdvertisements = await Advertisement.find({
      isActive: true,
      adPosition: adPosition,
      paymentStatus: "completed",
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Active advertisements fetched successfully.",
      data: activeAdvertisements
    });
  } catch (error) {
    console.error("Error fetching active advertisements:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch advertisements.",
      error: error.message,
    });
  }
};
