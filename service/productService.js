import Product from "../modals/product/product.js";
import { isShopOwner } from "./userService.js";

export const createProduct = async (req, res) => {
  if (!isShopOwner(req.user)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can create products.",
    });
  }
  try {
    const {
      shop_id,
      name,
      description,
      base_price,
      category,
      images,
      availabilityStatus,
      customization,
    } = req.body;

    const newProduct = new Product({
      shop_id,
      name,
      description,
      base_price,
      category,
      images,
      availabilityStatus,
      customization,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not create product.",
      error: error.message,
    });
  }
};

export const getProductsByShopOwnerId = async (shopOwnerId) => {
  if (!isShopOwner(req.user)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can create products.",
    });
  }
  try {
    const products = await Product.find({ shop_id: shopOwnerId });
    return products;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve products.",
      error: error.message,
    });
  }
};

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve product.",
      error: error.message,
    });
  }
};

export const updateProduct = async (productId, updateData) => {
  if (!isShopOwner(req.user)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can create products.",
    });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedProduct;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update product.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (productId) => {
  if (!isShopOwner(req.user)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can create products.",
    });
  }
  try {
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Could not delete product.",
      error: error.message,
    });
  }
};

export const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve products.",
      error: error.message,
    });
  }
};
