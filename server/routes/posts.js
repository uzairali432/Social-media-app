import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName surName profilePicture')
      .populate('comments.author', 'firstName surName profilePicture')
      .populate('likes', 'firstName surName')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search posts
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const posts = await Post.find({
      content: { $regex: q, $options: 'i' },
    })
      .populate('author', 'firstName surName profilePicture')
      .populate('comments.author', 'firstName surName profilePicture')
      .limit(20)
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post
router.post(
  '/',
  authMiddleware,
  [
    body('content').trim().notEmpty().withMessage('Post content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, image } = req.body;

      const post = new Post({
        author: req.userId,
        content,
        image,
      });

      await post.save();
      await post.populate('author', 'firstName surName profilePicture');

      res.status(201).json({
        message: 'Post created successfully',
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Delete post
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Already liked this post' });
    }

    post.likes.push(req.userId);
    await post.save();

    res.json({ message: 'Post liked successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unlike post
router.post('/:postId/unlike', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.userId);
    await post.save();

    res.json({ message: 'Post unliked successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Comment on post
router.post(
  '/:postId/comments',
  authMiddleware,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text } = req.body;
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      post.comments.push({
        author: req.userId,
        text,
      });

      await post.save();

      await post.populate([
        { path: 'author', select: 'firstName surName profilePicture' },
        { path: 'comments.author', select: 'firstName surName profilePicture' },
        { path: 'likes', select: 'firstName surName' },
      ]);

      res.status(201).json({
        message: 'Comment added successfully',
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

export default router;
