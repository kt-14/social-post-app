import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
Middleware to protect routes requiring authentication
Verifies JWT token and attaches user to request object
*/
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Extract token from header
      token = req.headers.authorization.split(" ")[1];

      //Validate token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from token and attach to request excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
          success: false,
        });
      }

      next();
    } catch (error) {
      console.error("Token verification error: ", error);
      return res.status(401).json({
        message: "Not authorized, token failed",
        success: false,
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token provided",
      success: false,
    });
  }
};
