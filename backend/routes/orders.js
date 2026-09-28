const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

// POST /checkout  { userId, items: [...], total, shippingInfo: {...} }
router.post('/checkout', async (req, res) => {
  const { userId, items, total, shippingInfo: s = {} } = req.body || {};

  if (!mongoose.isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
    return res.status(401).json({ success: false, message: 'Please log in again before placing your order.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your bag is empty.' });
  }
  if (!s.fullName?.trim() || !s.address || !s.city || !s.postalCode) {
    return res.status(400).json({ success: false, message: 'Please complete your shipping details.' });
  }

  const clean = items.map((i) => ({
    productId: String(i.productId ?? ''),
    name: String(i.name ?? ''),
    quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
    price: Number(i.price) || 0,
    size: i.size || undefined,
    scent: i.scent || undefined,
    note: i.note || undefined,
  }));
  // Work the total out here rather than trusting the browser's number.
  const computed = Math.round(clean.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
  if (Number.isFinite(Number(total)) && Math.abs(Number(total) - computed) > 1) {
    return res.status(400).json({ success: false, message: 'Your bag changed. Please review it and try again.' });
  }

  const order = await Order.create({
    user: userId,
    items: clean,
    total: computed,
    shipping: {
      fullName: s.fullName.trim(),
      address: s.address,
      city: s.city,
      postalCode: String(s.postalCode),
      country: s.country || 'Pakistan',
      contact: s.phone || undefined,
    },
  });

  res.status(201).json({ success: true, message: 'Order placed.', orderId: order._id.toString() });
});

module.exports = router;
