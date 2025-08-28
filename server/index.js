/**
 * @file server.js
 * @description EcoWasteConnect backend API using Express with in-memory storage (demo mode)
 * @note Replace in-memory arrays with MongoDB or another database in production.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ------------------- In-Memory Data (Demo Mode) ------------------- //
// Replace with database (e.g., MongoDB) for production use.
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@user.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0123',
    community: 'Green Valley Community',
    address: '123 Main Street, Green City, GC 12345',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '2', 
    name: 'Admin User',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-0124',
    community: null,
    address: null,
    isActive: true,
    createdAt: new Date()
  }
];

let pickups = [
  {
    id: '1',
    user: '1',
    date: '2023-11-05',
    timeSlot: 'Morning (8:00 AM - 12:00 PM)',
    wasteType: 'Recyclable Waste',
    address: '123 Community St, City, State',
    notes: 'Bins are behind the gate',
    status: 'Scheduled',
    createdAt: new Date()
  }
];

let issues = [
  {
    id: '1',
    issueId: 'ISS231101001',
    reporter: '1',
    type: 'missed_pickup',
    title: 'Missed Pickup',
    description: 'Scheduled pickup was missed on October 20, 2023',
    location: {
      address: {
        street: '123 Main Street',
        city: 'Green City',
        state: 'GC',
        zipCode: '12345'
      }
    },
    status: 'new',
    priority: 'medium',
    createdAt: new Date()
  }
];

// ------------------- App Initialization ------------------- //
const app = express();

// ------------------- Middleware ------------------- //
app.use(cors({
  origin: true, // Allow any origin for demo purposes
  credentials: true
}));
app.use(express.json()); // Parse JSON body
app.use(express.static(path.join(__dirname, '../dist/spa'))); // Serve static frontend files

// ------------------- Authentication Middleware ------------------- //
// Simple demo auth middleware using base64 token
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  
  const token = authHeader.substring(7);
  
  // Decode token (replace with JWT for production)
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = users.find(u => u.id === decoded.userId && u.isActive);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Generate a basic token (for demo only)
const generateToken = (userId) => {
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64');
};

// ------------------- Auth Routes ------------------- //
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user and validate password
  const user = users.find(u => u.email === email && u.isActive);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = generateToken(user.id);
  const userResponse = { ...user };
  delete userResponse.password; // Remove sensitive info
  
  res.json({
    success: true,
    message: 'Login successful',
    data: { user: userResponse, token }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, communityName, address } = req.body;
  
  // Check for duplicate email
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password,
    role: email.endsWith('@admin.com') ? 'admin' : 'user',
    phone,
    community: communityName,
    address,
    isActive: true,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  const token = generateToken(newUser.id);
  const userResponse = { ...newUser };
  delete userResponse.password;
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user: userResponse, token }
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const userResponse = { ...user };
  delete userResponse.password;
  
  res.json({ success: true, data: { user: userResponse } });
});

// ------------------- Pickup Routes ------------------- //
app.get('/api/pickups', auth, (req, res) => {
  // Admin sees all pickups, user sees only their pickups
  let userPickups = pickups;
  if (req.user.role === 'user') {
    userPickups = pickups.filter(p => p.user === req.user.id);
  }
  
  res.json({
    success: true,
    data: {
      pickups: userPickups,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: userPickups.length,
        itemsPerPage: userPickups.length
      }
    }
  });
});

app.post('/api/pickups', auth, (req, res) => {
  const newPickup = {
    id: String(pickups.length + 1),
    user: req.user.id,
    ...req.body,
    status: 'Scheduled',
    createdAt: new Date()
  };
  
  pickups.push(newPickup);
  
  res.status(201).json({
    success: true,
    message: 'Pickup scheduled successfully',
    data: { pickup: newPickup }
  });
});

app.put('/api/pickups/:id', auth, (req, res) => {
  const pickupIndex = pickups.findIndex(p => p.id === req.params.id);
  if (pickupIndex === -1) {
    return res.status(404).json({ success: false, message: 'Pickup not found' });
  }
  
  const pickup = pickups[pickupIndex];
  if (req.user.role === 'user' && pickup.user !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  pickups[pickupIndex] = { ...pickup, ...req.body, updatedAt: new Date() };
  
  res.json({
    success: true,
    message: 'Pickup updated successfully',
    data: { pickup: pickups[pickupIndex] }
  });
});

app.delete('/api/pickups/:id', auth, (req, res) => {
  const pickupIndex = pickups.findIndex(p => p.id === req.params.id);
  if (pickupIndex === -1) {
    return res.status(404).json({ success: false, message: 'Pickup not found' });
  }
  
  const pickup = pickups[pickupIndex];
  if (req.user.role === 'user' && pickup.user !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  pickups.splice(pickupIndex, 1);
  res.json({ success: true, message: 'Pickup deleted successfully' });
});

// ------------------- Issue Routes ------------------- //
app.get('/api/issues', auth, (req, res) => {
  let userIssues = issues;
  if (req.user.role === 'user') {
    userIssues = issues.filter(i => i.reporter === req.user.id);
  }
  
  res.json({
    success: true,
    data: {
      issues: userIssues,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: userIssues.length,
        itemsPerPage: userIssues.length
      }
    }
  });
});

app.post('/api/issues', auth, (req, res) => {
  const newIssue = {
    id: String(issues.length + 1),
    issueId: `ISS${Date.now()}`,
    reporter: req.user.id,
    ...req.body,
    status: 'new',
    priority: req.body.priority || 'medium',
    createdAt: new Date()
  };
  
  issues.push(newIssue);
  
  res.status(201).json({
    success: true,
    message: 'Issue reported successfully',
    data: { issue: newIssue }
  });
});

// ------------------- User Routes (Admin only) ------------------- //
app.get('/api/users', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  const userList = users.map(u => {
    const user = { ...u };
    delete user.password;
    return user;
  });
  
  res.json({
    success: true,
    data: {
      users: userList,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: userList.length,
        itemsPerPage: userList.length
      }
    }
  });
});

// ------------------- Analytics Routes ------------------- //
app.get('/api/analytics/overview', auth, (req, res) => {
  const stats = {
    totalUsers: users.filter(u => u.isActive).length,
    totalPickups: pickups.length,
    completedPickups: pickups.filter(p => p.status === 'Completed').length,
    totalIssues: issues.length,
    resolvedIssues: issues.filter(i => i.status === 'resolved').length,
    recentActivity: [
      { action: 'New pickup scheduled', time: '2 hours ago', type: 'pickup' },
      { action: 'Issue reported', time: '4 hours ago', type: 'issue' },
      { action: 'User registered', time: '6 hours ago', type: 'user' }
    ]
  };
  
  res.json({ success: true, data: stats });
});

// ------------------- Health Check ------------------- //
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ------------------- SPA Fallback ------------------- //
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/spa/index.html'));
});

// ------------------- Global Error Handler ------------------- //
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ------------------- Server Initialization ------------------- //
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 EcoWasteConnect Backend running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend will be served from /dist/spa`);
  console.log(`📊 API endpoints available at /api/*`);
});

module.exports = app;
