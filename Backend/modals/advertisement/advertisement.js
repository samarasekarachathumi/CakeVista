import mongoose from "mongoose";

const { Schema } = mongoose;

const advertisementSchema = new Schema(
  {
    shopOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "ShopOwner",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    adPosition: {
      type: String,
      enum: ["top", "popup"],
      default: "top",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: false,
    },

  },
  { timestamps: true }
);

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
