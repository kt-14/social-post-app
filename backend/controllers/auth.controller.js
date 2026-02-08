import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

//Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.HWT_EXPIRE || "7d",
  });
};

/** Register a new user
POST /api/auth/signup
*/
export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        success: false,
      });
    }

    const { username, email, password } = req.body;

    //Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === email
            ? "Email already registered"
            : "Username already taken",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
      success: false,
    });
  }
};

/**
Login user
POST /api/auth/login
*/
export const login = async (req, res) => {
  try {
    //Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        success: false,
      });
    }

    const { email, password } = req.body;

    //Check if user exists (we include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Wrong password entered",
        success: false,
      });
    }

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

/**
Get current user profile
GET /api/auth/me
*/
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      success: true,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
