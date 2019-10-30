const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET /api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) return res.status(400).json({ msg: 'No Profile for this user' });

    res.send(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

    const { company, website, location, bio, status, githubusername, skills, ...social } = req.body;

    const profileFields = JSON.parse(
      JSON.stringify({
        user: req.user.id,
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills: skills.split(',').map(skill => skill.trim()),
        social,
      }),
    );
    // console.log(profileFields);
    // console.log(social);

    try {
      const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true },
      );
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   GET /api/profile
// @desc    Get all user profiles
// @access  Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET /api/profile/user/:user_id
// @desc    Get user profile by user_id
// @access  Public

router.get('/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const profile = await Profile.findOne({ user: userID }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).send('Profile not found');
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'CastError') return res.status(400).send('Profile not found');
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
