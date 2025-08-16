import express from 'express';
import { registerUser, loginUser } from "../service/userService.js";

const userController = express.Router();

userController.post("/register", registerUser);
userController.post("/login", loginUser);

export default userController;