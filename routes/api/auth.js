const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// @route   POST /api/auth
// @desc    Authenticate user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      if (!user.confirmed)
        return res.status(400).json({ errors: [{ msg: 'Please confirm your email to login' }] });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1d' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
