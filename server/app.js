/**
 * @file server.js
 * @description Express server setup for EcoWasteConnect with MongoDB, routes, and error handling
 * @author Your Name
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

// Import API route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const communityRoutes = require('./routes/communities');
const pickupRoutes = require('./routes/pickups');
const routeRoutes = require('./routes/routes');
const issueRoutes = require('./routes/issues');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// -------------------- MIDDLEWARE -------------------- //
// Enable CORS for client (default: http://localhost:8080)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));

// Parse JSON and URL-encoded data with increased size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// HTTP request logger
app.use(morgan('combined'));

// -------------------- DATABASE CONNECTION -------------------- //
// Connect to MongoDB if URI is provided or if in production
if (process.env.MONGODB_URI || process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecowasteconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Running without database connection (demo mode)');
  });
} else {
  console.log('📝 Running in demo mode without MongoDB connection');
}

// -------------------- API ROUTES -------------------- //
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint for monitoring server and DB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// -------------------- STATIC FILES (Production) -------------------- //
// Serve built frontend (e.g., Vue/React/Quasar) in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/spa')));
  
  // Handle SPA routing by serving index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/spa/index.html'));
  });
}

// -------------------- ERROR HANDLING -------------------- //
// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle invalid MongoDB ObjectId errors
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry detected'
    });
  }

  // General server error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// -------------------- 404 HANDLER -------------------- //
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// -------------------- SERVER START -------------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:8080'}`);
});

// Export app for testing purposes
module.exports = app;
