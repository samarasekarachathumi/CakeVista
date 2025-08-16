import mongoose from "mongoose";

const selectedOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selected_customizations: {
      color: selectedOptionSchema,
      flavour: selectedOptionSchema,
      size: selectedOptionSchema,
      extra_toppings: [selectedOptionSchema],
      custom_message: {
        message: {
          type: String,
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopOwner",
      required: true,
    },
    items: [orderItemSchema],
    total_amount: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    order_status: {
      type: String,
      enum: ["Pending", "Processing", "Ready", "Delivered", "Cancelled"],
      default: "Pending",
    },
    delivery_address: {
      type: String,
      required: true,
    },
    delivery_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
