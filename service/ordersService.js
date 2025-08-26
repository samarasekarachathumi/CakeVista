import Order from "../modals/orders/orders.js";
import Product from "../modals/product/product.js";
import mongoose from "mongoose";
import { getCustomerByReq, isCustomer, isShopOwner, isAdmin } from "../service/userService.js";

// Save a new order
export const createOrder = async (req, res) => {
  if (!isCustomer(req)) { // Access control check
    return res.status(403).json({
      success: false,
      message: "Access denied. Only customers can create orders.",
    });
  }
  try {
    const { orderItems, address, paymentMethod, instructions, customer_id } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items in the order." });
    }

    const customer = await getCustomerByReq(req);
    const customerId = customer._id;

    // 1. Group order items by shop
    const shopsMap = new Map();
    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error("Invalid product ID.");
      }

      // Fetch the product to get its shop_id
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }

      const shopId = product.shop_id.toString();
      if (!shopsMap.has(shopId)) {
        shopsMap.set(shopId, { shop_id: product.shop_id, items: [] });
      }
      shopsMap.get(shopId).items.push(item);
    }

    const createdOrders = [];

    // 2. Create a separate order for each shop
    for (const [shopId, shopData] of shopsMap.entries()) {
      let totalAmount = 0;
      const orderItemsForShop = await Promise.all(
        shopData.items.map(async (item) => {
          const product = await Product.findById(item.productId); // Product is already fetched, but let's re-fetch for simplicity
          const basePrice = product.discountPrice || product.basePrice;
          let customPrice = 0;
          
          const selected_customizations = {};
          const payloadCustomization = item.customization;

          if (payloadCustomization) {
            // Logic to calculate custom price and structure customizations
            if (payloadCustomization.size) {
              const sizeOption = product.customization.size.find(
                (s) => s.name === payloadCustomization.size
              );
              if (sizeOption) {
                customPrice += sizeOption.price;
                selected_customizations.size = { name: sizeOption.name, price: sizeOption.price };
              }
            }
            if (payloadCustomization.toppings && payloadCustomization.toppings.length > 0) {
              const toppings = [];
              for (const toppingName of payloadCustomization.toppings) {
                const toppingOption = product.customization.toppings.find(
                  (t) => t.name === toppingName
                );
                if (toppingOption) {
                  customPrice += toppingOption.price;
                  toppings.push({ name: toppingOption.name, price: toppingOption.price });
                }
              }
              selected_customizations.extra_toppings = toppings;
            }
            if (payloadCustomization.cakeText) {
              selected_customizations.custom_message = {
                message: payloadCustomization.cakeText,
                price: 0,
              };
            }
          }
          
          const itemPrice = (basePrice + customPrice) * item.quantity;
          totalAmount += itemPrice;

          return {
            product_id: item.productId,
            quantity: item.quantity,
            selected_customizations,
            price: itemPrice,
          };
        })
      );

      const newOrder = new Order({
        customer_id: customerId,
        shop_id: shopData.shop_id,
        items: orderItemsForShop,
        total_amount: totalAmount,
        payment_type: paymentMethod,
        delivery_address: address,
        instructions: instructions,
      });

      const savedOrder = await newOrder.save();
      createdOrders.push(savedOrder);
    }
    
    // Respond with all created orders
    res.status(201).json({ 
      message: "Orders created successfully", 
      orders: createdOrders 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Failed to create orders", 
      error: error.message 
    });
  }
};
export const getOrderById = async (req, res) => {
  if (!isCustomer(req) && !isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only customers and shop owners can view orders.",
    });
  }
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(id).populate("customer_id shop_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve order", error: error.message });
  }
};

export const getOrdersByCustomer = async (req, res) => {
  if (!isCustomer(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only customers can view their orders.",
    });
  }
  try {
    const { customer_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customer_id)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }

    const orders = await Order.find({ customer_id }).populate("shop_id");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: error.message });
  }
};

export const getOrdersByShop = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can view orders.",
    });
  }
  try {
    const { shop_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(shop_id)) {
      return res.status(400).json({ message: "Invalid shop ID." });
    }

    const orders = await Order.find({ shop_id }).populate("customer_id");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this shop." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only customers and shop owners can update orders.",
    });
  }
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  if (!isCustomer(req) && !isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only customers and shop owners can delete orders.",
    });
  }
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can update payment status.",
    });
  }
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res
      .status(200)
      .json({ message: "Order payment status updated successfully", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to update order payment status",
        error: error.message,
      });
  }
};

export const updateDeliveryDateAndStatus = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only shop owners can update delivery date and status.",
    });
  }
  try {
    const { id } = req.params;
    const { deliveryDate, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.delivery_date = deliveryDate;
    order.status = status;
    await order.save();

    res
      .status(200)
      .json({
        message: "Order delivery date and status updated successfully",
        order,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to update order delivery date and status",
        error: error.message,
      });
  }
};

export const getAllOrders = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins, shop owners, and customers can view orders.",
    });
  }
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch orders.",
      error: error.message,
    });
  }
}
