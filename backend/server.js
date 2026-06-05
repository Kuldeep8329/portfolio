require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const portfolioRoutes = require('./routes/portfolio');
const adminRoutes = require('./routes/admin');
const initializeDatabase = require('./scripts/dbInit');
const migrateJsonIds = require('./scripts/migrateJsonIds');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests (including admin actions like PUT, DELETE, and JWT headers)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api', portfolioRoutes);
app.use('/api/admin', adminRoutes);

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

// Run JSON ID migration check, then initialize database schema and start server
migrateJsonIds()
  .then(() => initializeDatabase())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Fatal database initialization failed. Starting server anyway. Error:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (Database offline)`);
    });
  });

