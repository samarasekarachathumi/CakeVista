import Product from "../modals/product/product.js";
import { isShopOwner, getShopOwnerByReq} from "./userService.js";

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

    const shopOwner = await getShopOwnerByReq(req);

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

export const getProductsByShopOwner = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can view their products.",
    });
  }
  try {
    const shopOwner = await getShopOwnerByReq(req);
    const products = await Product.find({ shop_id: shopOwner._id });
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

export const getProductsByShopOwnerId = async (req, res) => {
  try {
    const shopOwner = req.params.shopOwnerId;
    const products = await Product.find({ shop_id: shopOwner });
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


export const updateProduct = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can update products.",
    });
  }
  try {
    const { productId } = req.params;
    const shopOwner = await getShopOwnerByReq(req);
    const updateData = req.body;

    // Check if the product belongs to the shop owner
    const product = await Product.findOne({ _id: productId, shop_id: shopOwner._id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied.",
      });
    }

    // Handle nested 'availability' object update
    // This allows for partial updates of stock or status
    if (updateData.stock !== undefined) {
      product.availability.stock = updateData.stock;
    }
    if (updateData.availabilityStatus !== undefined) {
      product.availability.status = updateData.availabilityStatus;
    }

    // Apply other updates
    const fieldsToUpdate = ['name', 'description', 'basePrice', 'discountPrice', 'categories', 'images', 'customization'];
    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) {
        product[field] = updateData[field];
      }
    });

    const updatedProduct = await product.save();

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

export const deleteProduct = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can delete products.",
    });
  }
  try {
    const { productId } = req.params;
    const shopOwner = await getShopOwnerByReq(req);
    
    // Find and delete the product, ensuring it belongs to the logged-in shop owner
    const product = await Product.findOneAndDelete({
      _id: productId,
      shop_id: shopOwner._id,
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied.",
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
      data: products, // can be [] if no products
      count: products.length, // 👈 optional, useful for frontend
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

export const getLeastAddedProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 }).limit(12);
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving least added products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve least added products.",
      error: error.message,
    });
  }
};
