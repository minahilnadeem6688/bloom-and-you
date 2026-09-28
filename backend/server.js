const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB not connected yet:', err.message));

app.listen(PORT, () => console.log(`Bloom & You API on http://localhost:${PORT}`));
