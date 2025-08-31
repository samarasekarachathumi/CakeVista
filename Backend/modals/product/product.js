import mongoose from "mongoose";

// Sub-schema for customization options to ensure consistent validation
const CustomizationSchema = new mongoose.Schema({
  color: [{ name: { type: String }, price: { type: Number, default: 0 } }],
  flavor: [{ name: { type: String }, price: { type: Number, default: 0 } }],
  size: [{ name: { type: String }, price: { type: Number, default: 0 } }],
  toppings: [{ name: { type: String }, price: { type: Number, default: 0 } }],
  customMessage: {
    isAvailable: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
  },
});

const ProductSchema = new mongoose.Schema(
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
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    // New: Use a Map to store categories as key-value pairs
    categories: {
      type: Map,
      of: [String],
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    // New: Explicitly define the nested availability object
    availability: {
      stock: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ["In Stock", "Out of Stock"],
        default: "Out of Stock",
      },
    },
    customization: {
      type: CustomizationSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    minimize: false, // Prevents Mongoose from stripping out empty objects
  }
);

ProductSchema.index({ shop_id: 1, name: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
