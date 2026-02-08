import express from "express";
import { body } from "express-validator";
import {protect} from "../middlewares/auth.js";
import {
  addComment,
  createPost,
  deletePost,
  getPostById,
  getPosts,
  toggleLike,
} from "../controllers/post.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//Validation rules for creating a post
const createPostValidation = [
  body("content")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Post cannot exceed more than 2000 characters"),
];

//Validation rules for comments
const addCommentValidation = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceeed 500 characters"),
];

//All post routes require authentication
router.use(protect);

router
  .route("/")
  .post(upload.single("image"), createPostValidation, createPost);
router.route("/").get(getPosts);
router.route("/:id").get(getPostById);
router.route("/:id").delete(deletePost);

//Like and comment operations
router.route("/:id/like").put(toggleLike);
router.route("/:id/comment").post(addCommentValidation, addComment);

export default router;