import ShopOwner from "../modals/users/ShopOwner.js";
import User from "../modals/users/Users.js";
import Order from "../modals/orders/orders.js";
import Product from "../modals/product/product.js";
import { isAdmin } from "../service/userService.js";

export const getAllShopOwners = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can fetch shop owners.",
    });
  }
  try {
    const shopOwners = await ShopOwner.find();
    const users = await User.find({
      _id: { $in: shopOwners.map((owner) => owner.userId) },
    });
    return res.status(200).json({
      success: true,
      message: "Shop owners fetched successfully.",
      data: shopOwners.map((owner) => ({
        ...owner.toObject(),
        user: users.find((user) => user._id.equals(owner.userId)),
      })),
    });
  } catch (error) {
    console.error("Error fetching shop owners:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch shop owners.",
      error: error.message,
    });
  }
};

export const updateShopStatus = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can update shop status.",
    });
  }

  const { id } = req.params;
  const { isActive } = req.body;
  console.log("Updating shop status:", { id, isActive });
  try {
    const activeValue =
      typeof isActive === "object" ? isActive.isActive : isActive;
    const updatedShop = await ShopOwner.findByIdAndUpdate(
      id,
      { isActive: activeValue !== undefined ? activeValue : false },
      { new: true, runValidators: true }
    );
    if (!updatedShop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop status updated successfully.",
      data: updatedShop,
    });
  } catch (error) {
    console.error("Error updating shop status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update shop status.",
      error: error.message,
    });
  }
};

export const getActiveShops = async (req, res) => {
  try {
    const activeShops = await ShopOwner.find({ isActive: true });
    const currentShopOrders = await Order.find({
      shopId: { $in: activeShops.map((shop) => shop._id) },
    });
    const shopsWithRatings = activeShops.map((shop) => {
      const shopOrders = currentShopOrders.filter(
        (order) => order.shopId.toString() === shop._id.toString()
      );
      const deliveredCount = shopOrders.filter(
        (order) => order.order_status === "Delivered"
      ).length;
      const cancelledCount = shopOrders.filter(
        (order) => order.order_status === "Cancelled"
      ).length;
      const totalConsidered = deliveredCount + cancelledCount;
      const rating =
        totalConsidered > 0
          ? ((deliveredCount / totalConsidered) * 100).toFixed(2)
          : "0.00";

      return {
        ...shop.toObject(),
        rating: Number(rating),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Active shops fetched successfully.",
      data: shopsWithRatings,
    });
  } catch (error) {
    console.error("Error fetching active shops:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch active shops.",
      error: error.message,
    });
  }
};

export const getShopDetailsShopOwnerId = async (req, res) => {
  try {
    const shopOwner = await ShopOwner.findOne({ userId: req.user.userId });
    if (!shopOwner) {
      return res.status(404).json({
        success: false,
        message: "Shop owner not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Shop owner details fetched successfully.",
      data: shopOwner,
    });
  } catch (error) {
    console.error("Error fetching shop owner details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch shop owner details.",
      error: error.message,
    });
  }
};

export const updateShopDetails = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  try {
    const updatedShop = await ShopOwner.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return res.status(404).json({
        success: false,
        message: "Shop owner not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop owner details updated successfully.",
      data: updatedShop,
    });
  } catch (error) {
    console.error("Error updating shop owner details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update shop owner details.",
      error: error.message,
    });
  }
};

export const getProductsByShopOwnerId = async (req, res) => {
  const { id } = req.params;
  try {
    const shopOwner = await ShopOwner.findOne({ _id: id });
    if (!shopOwner) {
      return res.status(404).json({
        success: false,
        message: "Shop owner not found.",
      });
    }

    const products = await Product.find({
      shop_id: shopOwner._id
    });
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: { shopOwner: shopOwner.toObject(), products },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not fetch products.",
      error: error.message,
    });
  }
};
