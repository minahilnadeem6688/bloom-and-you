/**
 * Bloom & You API: the Express app, shared by
 *   server.js      a normal long-running server (local, Render, Railway...)
 *   api/index.js   a Vercel serverless function
 */
require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// CORS_ORIGIN: comma-separated list of allowed sites (e.g. the shop's Vercel URL). Empty = allow all.
const origins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
app.use(cors(origins.length ? { origin: origins } : {}));
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => res.send('Bloom & You API is running. See /health.'));

app.get('/health', async (_req, res) => {
  let databaseError;
  await connectDB().catch((err) => { databaseError = err.message; });
  res.json({ server: true, database: mongoose.connection.readyState === 1, ...(databaseError ? { databaseError } : {}) });
});

// Everything below needs the database
app.use((_req, res, next) => {
  connectDB().then(() => next(), () =>
    res.status(503).json({ success: false, message: 'The shop is having trouble connecting. Please try again shortly.' }));
});

app.use(require('./routes/auth'));
app.use(require('./routes/orders'));
app.use(require('./routes/contact'));

app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Invalid request.' });
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Some details are missing or invalid.' });
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
});

module.exports = app;
