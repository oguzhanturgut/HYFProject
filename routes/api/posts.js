const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { id } = req.user;
      const user = await User.findById(id).select({ name: 1, avatar: 1 });

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: id,
      };
      const post = new Post(newPost);
      await post.save();
      res.send(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'CastError') return res.status(400).json({ msg: 'Post not found' });
    res.status(500).send('Server Error');
  }
});
//TODO Update a post
// @route   DELETE /api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.name === 'CastError') return res.status(400).json({ msg: 'Post not found' });
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
      return res.status(400).json({ msg: 'Post already liked' });

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'CastError') return res.status(400).json({ msg: 'Post not found' });
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
      return res.status(400).json({ msg: 'Post has not yet been liked' });

    const removeIndex = post.likes.findIndex(like => like._id.toString() === id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'CastError') return res.status(400).json({ msg: 'Post not found' });
    res.status(500).send('Server Error');
  }
});
module.exports = router;
