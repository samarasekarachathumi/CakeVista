import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authenticate from "./helpers/authenticate.js";
import userController from "./controller/userController.js";
import productController from "./controller/productController.js";
import orderController from "./controller/ordersController.js";
import advertisementController from "./controller/advertisementController.js";
import shopController from "./controller/shopController.js";

dotenv.config();
const app = express();

const mongoUrl = process.env.MONGO_DB_URI;
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(authenticate);

// MongoDB connection
mongoose.connect(mongoUrl);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database connected");
});

//add endpoint here
app.use("/api/users", userController);
app.use("/api/products", productController);
app.use("/api/orders", orderController);
app.use("/api/advertisements", advertisementController);
app.use("/api/shops", shopController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
