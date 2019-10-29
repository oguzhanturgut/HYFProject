const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET /api/auth
// @desc    Test route
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select({ name: 1, email: 1, avatar: 1, date: 1 });
    res.send(user);
  } catch (error) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
