import Order from "../modals/orders/orders.js";
import Product from "../modals/product/product.js";
import mongoose from "mongoose";
import {isCustomer, isShopOwner} from "../service/userService.js"

// Save a new order
export const createOrder = async (req, res) => {
  if (!isCustomer(req) || !isShopOwner(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can create orders.",
      });
    }
  try {
    const { customer_id, shop_id, items, delivery_address, delivery_date } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order." });
    }

    let totalAmount = 0;

    // Process each item
    const orderItems = await Promise.all(
      items.map(async (item) => {
        if (!mongoose.Types.ObjectId.isValid(item.product_id)) {
          throw new Error("Invalid product ID.");
        }

        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new Error("Product not found.");
        }

        const basePrice = product.base_price;
        let customPrice = 0;

        // Add price for selected customizations
        if (item.selected_customizations) {
          const custom = item.selected_customizations;

          if (custom.color) {
            const colorOption = product.customization.colorOptions.find(
              (c) => c.name === custom.color.name
            );
            customPrice += colorOption ? colorOption.price : 0;
          }

          if (custom.flavour) {
            const flavourOption = product.customization.flavourOptions.find(
              (f) => f.name === custom.flavour.name
            );
            customPrice += flavourOption ? flavourOption.price : 0;
          }

          if (custom.size) {
            const sizeOption = product.customization.sizeOptions.find(
              (s) => s.name === custom.size.name
            );
            customPrice += sizeOption ? sizeOption.price : 0;
          }

          if (custom.extra_toppings && custom.extra_toppings.length > 0) {
            custom.extra_toppings.forEach((topping) => {
              const toppingOption = product.customization.extraToppings.find(
                (t) => t.name === topping.name
              );
              customPrice += toppingOption ? toppingOption.price : 0;
            });
          }

          if (custom.custom_message) {
            const messageOption = product.customization.customMessage.find(
              (m) => m.message === custom.custom_message.message
            );
            customPrice += messageOption ? messageOption.price : 0;
          }
        }

        const itemPrice = (basePrice + customPrice) * item.quantity;
        totalAmount += itemPrice;

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          selected_customizations: item.selected_customizations,
          price: itemPrice,
        };
      })
    );

    // Create the order
    const order = new Order({
      customer_id,
      shop_id,
      items: orderItems,
      total_amount: totalAmount,
      delivery_address,
      delivery_date,
    });

    const savedOrder = await order.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
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
    res.status(500).json({ message: "Failed to retrieve order", error: error.message });
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
      return res.status(404).json({ message: "No orders found for this customer." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
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
      return res.status(404).json({ message: "No orders found for this shop." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only customers and shop owners can update orders.",
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

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  if (!isCustomer(req) && !isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only customers and shop owners can delete orders.",
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
    res.status(500).json({ message: "Failed to delete order", error: error.message });
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

    res.status(200).json({ message: "Order payment status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order payment status", error: error.message });
  }
};

export const updateDeliveryDateAndStatus = async (req, res) => {
  if (!isShopOwner(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only shop owners can update delivery date and status.",
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

    res.status(200).json({ message: "Order delivery date and status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order delivery date and status", error: error.message });
  }
};
