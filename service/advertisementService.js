import Advertisement from "../modals/advertisement/advertisement.js";
import { isShopOwner, isAdmin } from "./userService.js";

export const createAdvertisement = async (adData) => {
  if (!isShopOwner(req) || !isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only shop owners and admins can create advertisements.",
    });
  }
  try {
    const {
      shopOwnerId,
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      adPosition,
      paymentStatus,
    } = adData;

    const advertisement = new Advertisement({
      shopOwnerId,
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      adPosition: adPosition || "top",
      paymentStatus: paymentStatus || "pending",
      isActive: false,
    });

    await advertisement.save();

    return advertisement;
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not create advertisement.",
      error: error.message,
    });
  }
};

export const getAllAdvertisements = async () => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can update advertisements.",
    });
  }
  try {
    const advertisements = await Advertisement.find();
    return advertisements;
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve advertisements.",
      error: error.message,
    });
  }
};

export const updateAdvertisement = async (adId, updateData) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can update advertisements.",
    });
  }
  try {
    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      adId,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedAdvertisement;
  } catch (error) {
    console.error("Error updating advertisement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update advertisement.",
      error: error.message,
    });
  }
};

export const deleteAdvertisement = async (adId) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can delete advertisements.",
    });
  }
  try {
    await Advertisement.findByIdAndDelete(adId);
    return { success: true, message: "Advertisement deleted successfully." };
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not delete advertisement.",
      error: error.message,
    });
  }
};

export const updateAdvertisementStatus = async (adId, paymentStatus) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only shop owners can update advertisement status.",
    });
  }
  try {
    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      adId,
      { paymentStatus },
      { new: true, runValidators: true }
    );
    return updatedAdvertisement;
  } catch (error) {
    console.error("Error updating advertisement status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update advertisement status.",
      error: error.message,
    });
  }
};

export const updateIsActiveAdvertisement = async (req, res) => {
  const { adId } = req.params;
  const { isActive } = req.body;
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can update advertisement status.",
    });
  }
  try {
    const ad = await Advertisement.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    if (isActive) {
      await Advertisement.updateMany(
        { adPosition: ad.adPosition, _id: { $ne: ad._id } },
        { $set: { isActive: false } }
      );
    }

    ad.isActive = isActive;
    await ad.save();

    return res.status(200).json({
      success: true,
      message: "Advertisement status updated successfully",
      advertisement: ad,
    });
  } catch (error) {
    console.error("Error updating advertisement status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update advertisement status.",
      error: error.message,
    });
  }
};


export const updateIsActiveStatus = async (req, res) => {
  const { adId } = req.params;
  const { isActive } = req.body;
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can update advertisement status.",
    });
  }
  try {
    const ad = await Advertisement.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    if (isActive) {
      await Advertisement.updateMany(
        { adPosition: ad.adPosition, _id: { $ne: ad._id } },
        { $set: { isActive: false } }
      );
    }

    ad.isActive = isActive;
    await ad.save();

    return res.status(200).json({
      success: true,
      message: "Advertisement status updated successfully",
      advertisement: ad,
    });
  } catch (error) {
    console.error("Error updating advertisement status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update advertisement status.",
      error: error.message,
    });
  }
};
