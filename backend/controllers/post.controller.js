
import {Post} from "../models/post.model.js";
import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";

/**
 * Create a new post
 * POST /api/posts
 */
export const createPost = async (req, res) => {
  try {
    console.log('📝 Creating post...');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { content } = req.body;
    let imageUrl = null;

    // Check if image was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('✓ Image uploaded:', imageUrl);
    }

    // Validate that at least one field is provided
    if (!content && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Post must have either content or an image',
      });
    }

    // Create post
    const post = await Post.create({
      user: req.user._id,
      username: req.user.username,
      content: content || '',
      imageUrl,
    });

    console.log('✓ Post created successfully:', post._id);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: error.message,
    });
  }
};

/**
 * Get all posts with pagination
 * GET /api/posts?page=1&limit=10
 */
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`📋 Fetching posts - Page: ${page}, Limit: ${limit}`);

    // Get total count for pagination
    const totalPosts = await Post.countDocuments();

    // Fetch posts sorted by most recent first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add likes count and comments count to each post
    const postsWithCounts = posts.map((post) => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
    }));

    console.log(`✓ Fetched ${postsWithCounts.length} posts`);

    res.status(200).json({
      success: true,
      data: postsWithCounts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: page * limit < totalPosts,
      },
    });
  } catch (error) {
    console.error('❌ Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: error.message,
    });
  }
};

/**
 * Get a single post by ID
 * GET /api/posts/:id
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...post.toObject(),
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
      },
    });
  } catch (error) {
    console.error('❌ Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post',
      error: error.message,
    });
  }
};

/**
 * Like or unlike a post
 * PUT /api/posts/:id/like
 */
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike: Remove the like
      post.likes.splice(likeIndex, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Post unliked',
        data: {
          ...post.toObject(),
          likesCount: post.likes.length,
          commentsCount: post.comments.length,
        },
      });
    } else {
      // Like: Add the like
      post.likes.push({
        user: req.user._id,
        username: req.user.username,
      });
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Post liked',
        data: {
          ...post.toObject(),
          likesCount: post.likes.length,
          commentsCount: post.comments.length,
        },
      });
    }
  } catch (error) {
    console.error('❌ Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling like',
      error: error.message,
    });
  }
};

/**
 * Add a comment to a post
 * POST /api/posts/:id/comment
 */
export const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Add comment
    post.comments.push({
      user: req.user._id,
      username: req.user.username,
      text,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        ...post.toObject(),
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
      },
    });
  } catch (error) {
    console.error('❌ Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment',
      error: error.message,
    });
  }
};

/**
 * Delete a post
 * DELETE /api/posts/:id
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Delete image file if exists
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, '..', post.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('✓ Deleted image:', imagePath);
      }
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: error.message,
    });
  }
};
