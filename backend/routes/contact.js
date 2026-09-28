const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const notifyContact = require('../lib/notify');

const router = express.Router();

// POST /contact  { name, email, message }
router.post('/contact', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Please fill in every field.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email.' });

  const saved = await ContactMessage.create({ name, email, message });

  // The message is already saved, so a failed email never fails the form.
  try {
    if (await notifyContact({ name, email, message })) {
      await ContactMessage.updateOne({ _id: saved._id }, { emailed: true });
    }
  } catch (err) {
    console.error('Contact email not sent:', err.message);
  }

  res.status(201).json({ success: true, message: 'Message received.' });
});

module.exports = router;
