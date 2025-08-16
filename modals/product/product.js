import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  colorOptions: [
    {
      name: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  flavourOptions: [
    {
      name: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  sizeOptions: [
    {
      name: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  extraToppings: [
    {
      name: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  customMessage: [
    {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopOwner",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    base_price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Birthday", "Wedding", "Cupcake", "Anniversary", "Other"],
      default: "Other",
    },
    images: {
      type: [String],
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
    customization: customizationSchema,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
