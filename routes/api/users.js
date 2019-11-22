const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

// @route   POST /api/users
// @desc    Register new user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
      }
      const avatar = gravatar.url(email, {
        protocol: 'http',
        size: '200',
        rating: 'p',
        default: 'identicon',
      });
      user = new User({ name, email, avatar, password });
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const emailToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1d' });

      const confirmURL = `http://localhost:5000/api/users/confirm/${emailToken}`;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: 'noreply@hackyourfuture.net',
        subject: 'Confirm Email',
        text: 'Click the link below to confirm your email.',
        html: `<a href=${confirmURL}>${confirmURL}</a>`,
      };

      await sgMail.send(msg);
      res.json({ msg: 'Confirmation mail sent', confirmURL });
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  },
);

// @route   GET /api/users/confirm/:emailToken
// @desc    Confirm user email
// @access  Public
router.get('/confirm/:emailToken', async (req, res) => {
  const { emailToken } = req.params;
  try {
    const {
      user: { id },
    } = jwt.verify(emailToken, config.get('jwtSecret'));
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { confirmed: true } },
      { new: true },
    );
    res.json({ msg: 'Email is confirmed' });
  } catch (error) {
    return res.status(401).send({ msg: 'Invalid Token' });
  }
});

module.exports = router;
