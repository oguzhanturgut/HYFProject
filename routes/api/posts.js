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

module.exports = router;
