import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authenticate from "./helpers/authenticate.js";

dotenv.config();
const app = express();
app.use(cors());

// MongoDB connection
const mongoUrl = process.env.MONGO_DB_URI;
mongoose.connect(mongoUrl);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database connected");
});

app.use(express.json());
app.use(authenticate);

//add endpoint here

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
