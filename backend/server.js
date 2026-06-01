require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // Allow all for local development, can specify http://localhost:5173 later
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api', portfolioRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred on the server.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
