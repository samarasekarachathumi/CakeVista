import Product from "../modals/product/product.js";
import { isShopOwner, getShopOwnerByUserId} from "./userService.js";

export const createProduct = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can create products.",
    });
  }
  try {
    const {
      name,
      description,
      basePrice,
      discountPrice,
      categories,
      images,
      availabilityStatus,
      stock,
      customization,
    } = req.body;

    const shopOwner = await getShopOwnerByUserId(req);

    const newProduct = new Product({
      shop_id: shopOwner._id,
      name,
      description,
      basePrice,
      discountPrice,
      categories,
      images,
      // Combine stock and status into a nested object
      availability: {
        stock,
        status: availabilityStatus
      },
      customization,
    });
    console.info('newProduct:', newProduct);
    const savedProduct = await newProduct.save();
    console.info('Product saved:', savedProduct._id);
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

export const getProductsByShopOwnerId = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can view their products.",
    });
  }
  try {
    const { shopOwnerId } = req.params;
    const products = await Product.find({ shop_id: shopOwnerId });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve products.",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve product.",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can update products.",
    });
  }
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    // Check if stock or availabilityStatus are being updated
    if (updateData.stock !== undefined || updateData.availabilityStatus !== undefined) {
      updateData.availability = {
        stock: updateData.stock,
        status: updateData.availabilityStatus,
      };
      delete updateData.stock;
      delete updateData.availabilityStatus;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not update product.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can delete products.",
    });
  }
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not delete product.",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving all products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve products.",
      error: error.message,
    });
  }
};
