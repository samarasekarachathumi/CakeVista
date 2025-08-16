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
    shopAddress: [
      {
        streetAddress: {
          type: String,
          required: false,
        },
        city: {
          type: String,
          required: false,
        },
        district: {
          type: String,
          required: false,
        },
        province: {
          type: String,
          required: false,
        },
      },
    ],
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
