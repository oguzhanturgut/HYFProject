const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const HOST_ADDR = process.env.HOST_ADDR || 'https://hyf-project-mail.herokuapp.com';

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

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const emailToken = jwt.sign(payload, config.get('emailSecret'), { expiresIn: '1d' });
      const confirmURL = `${HOST_ADDR}/confirm/${emailToken}`;

      const msg = {
        to: user.email,
        from: 'ye41687@gmail.com',
        subject: 'Confirm Email',
        html: `Hurrah! You've created a Developer Hub account with ${user.email}. Please take a moment to confirm that we can use this address to send you mails. <br/>
        <a href=${confirmURL}>${confirmURL}</a>`,
      };

      await transporter.sendMail(msg);
      res.json({ msg: 'Confirmation mail sent' });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   PUT /api/users/confirm/:emailToken
// @desc    Confirm user email
// @access  Public
router.put('/confirm/:emailToken', async (req, res) => {
  const { emailToken } = req.params;
  try {
    const {
      user: { id },
    } = jwt.verify(emailToken, config.get('emailSecret'));
    await User.findOneAndUpdate({ _id: id }, { $set: { confirmed: true } }, { new: true });
    // TODO handle error cases
    const payload = {
      user: {
        id,
      },
    };

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 999999 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    return res.status(401).send({ msg: 'Invalid Token' });
  }
});

module.exports = router;
