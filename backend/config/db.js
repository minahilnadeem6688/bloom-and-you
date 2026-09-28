const mongoose = require('mongoose');

// Reuse one connection per process (or per warm serverless instance).
let pending = null;

module.exports = function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!process.env.MONGO_URI) return Promise.reject(new Error('MONGO_URI is not set.'));
  if (!pending) {
    pending = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        pending = null; // try again on the next request
        throw err;
      });
  }
  return pending;
};
