const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    size: String,
    scent: String,
    note: { type: String, maxlength: 300 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [itemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    shipping: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Pakistan' },
      contact: String,
    },
    status: { type: String, enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
