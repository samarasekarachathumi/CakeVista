import express from 'express';
import { registerUser, loginUser, getAllUser, updateUserDetails } from "../service/userService.js";

const userController = express.Router();

userController.post("/register", registerUser);
userController.post("/login", loginUser);
userController.get("/all", getAllUser);
userController.patch("/update/:id", updateUserDetails);

export default userController;