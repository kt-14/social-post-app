import express from "express";
import { body } from "express-validator";
import { getUser, login, signup } from "../controllers/auth.controller.js";
import {protect} from "../middlewares/auth.js";

const router = express.Router();

//Validation rules for signup
const signupValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 to 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email").isEmail().withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
];

//Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

//Routes
router.route("/signup").post(signupValidation, signup);
router.route("/login").post(loginValidation, login);

//Protected routes
router.route("/me").get(protect, getUser);

export default router;