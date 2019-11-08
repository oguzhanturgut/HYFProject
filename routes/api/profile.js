const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

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

// @route   POST /api/profile
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
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'CastError') return res.status(400).json({ msg: 'Profile not found' });
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/profile
// @desc    Delete profile user and posts
// @access  Private

router.delete('/', auth, async (req, res) => {
  try {
    const { id } = req.user;
    // Delete user posts
    await Post.deleteMany({ user: id });
    // Delete profile
    await Profile.findOneAndRemove({ user: id });
    // Delete user
    await User.findOneAndRemove({ _id: id });

    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const newExperience = { ...req.body };
    try {
      const { id } = req.user;
      const profile = await Profile.findOne({ user: id });
      profile.experience.unshift(newExperience);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   DELETE /api/profile/experience/expID
// @desc    Delete profile experience
// @access  Private
router.delete('/experience/:expID', [auth], async (req, res) => {
  try {
    const { id } = req.user;
    const { expID } = req.params;
    const profile = await Profile.findOne({ user: id });
    const removeIndex = profile.experience.findIndex(exp => exp._id.toString() === expID);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// TODO Update experience

// @route   PUT /api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const newEducation = { ...req.body };
    try {
      const { id } = req.user;
      const profile = await Profile.findOne({ user: id });
      profile.education.unshift(newEducation);
      console.log(profile, newEducation);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   DELETE /api/profile/education/eduID
// @desc    Delete profile education
// @access  Private
router.delete('/education/:eduID', [auth], async (req, res) => {
  try {
    const { id } = req.user;
    const { eduID } = req.params;
    const profile = await Profile.findOne({ user: id });
    const removeIndex = profile.education.findIndex(edu => edu._id.toString() === eduID);
    profile.education.splice(removeIndex, 1);
    profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET /api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', (req, res) => {
  try {
    const { username } = req.params;
    const options = {
      uri: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId',
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) return res.status(400).send('No Github profile found');
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
