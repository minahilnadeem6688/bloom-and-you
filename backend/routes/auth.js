const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u._id.toString(), name: u.name, email: u.email });

// POST /register  { name, email, password }
router.post('/register', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Please fill in every field.' });
  if (!EMAIL.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
  if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

  if (await User.exists({ email })) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  try {
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ success: true, message: 'Account created.', user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    throw err;
  }
});

// POST /login  { email, password }
router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ success: false, message: 'Please enter your email and password.' });

  const user = await User.findOne({ email });
  // Same message either way, so the form doesn't reveal which emails have accounts.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
  }
  res.json({ success: true, message: 'Logged in.', user: publicUser(user) });
});

module.exports = router;
