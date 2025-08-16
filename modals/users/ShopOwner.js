// models/ShopOwner.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const shopOwnerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    shopAddress: {
      type: String,
      trim: true,
    },

    shopLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true }
);

const ShopOwner = mongoose.model("ShopOwner", shopOwnerSchema);
export default ShopOwner;
