import mongoose from "mongoose";

/**
Comment Sub-schema
Stores individual comments on posts
*/
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [500, "Comment cannot excedd 500 characters"],
    },
  },
  { timestamps: true },
);

/**
Like Sub-schema
Stores user information for likes
*/
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

/**
Post Schema
Stores post content, images, likes, and comments
*/
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: [2000, "Post content cannot exceed 2000 characters"],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    likes: [likeSchema],
    comments: [commentSchema],
  },
  { timestamps: true },
);

postSchema.path("content").validate(function () {
  return this.content || this.imageUrl;
}, "Post must have either content or image");



// Index for efficient querying

postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1 });

export const Post = mongoose.model('Post', postSchema);
