import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modals/users/Users.js";
import Customer from "../modals/users/Customer.js";
import ShopOwner from "../modals/users/ShopOwner.js";
import authConstants from "../constant/auth.js";
import dotenv from "dotenv";

dotenv.config();

const { CUSTOMER, ADMIN, SHOP_OWNER, TOKEN_VALID_TIME } = authConstants;

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      address,
      phone,
      shopName,
      shopAddress,
      shopLocation,
    } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the common User
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    let extraData;

    // 4. Create role-specific profile
    if (role === CUSTOMER) {
      const customer = new Customer({
        userId: user._id,
        address,
        phone,
      });
      await customer.save();
      extraData = customer;
    } else if (role === SHOP_OWNER) {
      const shopOwner = new ShopOwner({
        userId: user._id,
        shopName,
        shopAddress,
        shopLocation,
      });
      await shopOwner.save();
      extraData = shopOwner;
    }

    res.status(201).json({
      message: `${role} registered successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isActive === false) {
      return res
        .status(403)
        .json({ message: "Your Login is Disabled. Please contact support." });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Fetch role-specific data
    let extraData;
    if (user.role === CUSTOMER) {
      extraData = await Customer.findOne({ userId: user._id });
    } else if (user.role === SHOP_OWNER) {
      extraData = await ShopOwner.findOne({ userId: user._id });
    }

    // 4. Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_VALID_TIME,
    });

    const loginUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      user: loginUser,
      extraData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != ADMIN) {
    return false;
  }
  return true;
}

export function isCustomer(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != CUSTOMER) {
    return false;
  }
  return true;
}

export function isShopOwner(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != SHOP_OWNER) {
    return false;
  }
  return true;
}

export const getShopOwnerByReq = async (req) => {
  try {
    const shopOwner = await ShopOwner.findOne({ userId: req.user.userId });
    return shopOwner;
  } catch (error) {
    console.error("Error fetching shop owner:", error);
    throw new Error("Server error. Could not retrieve shop owner.");
  }
};

export const getCustomerByReq = async (req) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.userId });
    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Server error. Could not retrieve customer.");
  }
};

export const getAllUser = async (req, res) => {
  if(!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch users.",
      error: error.message,
    });
  }
};

export const updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (updatedUser.role) {
      if (updateFields.role === "ShopOwner") {
        await ShopOwner.findByIdAndUpdate(
          { userId: id },
          { $set: updateFields },
          { new: true, runValidators: true }
        );
      } else if (updateFields.role === "Customer") {
        await Customer.findByIdAndUpdate(
          { userId: id },
          { $set: updateFields },
          { new: true, runValidators: true }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `${updatedUser.firstName}'s details updated successfully.`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update user details.",
      error: error.message,
    });
  }
};
