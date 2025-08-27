const express = require('express');
const { body, validationResult } = require('express-validator');
const Route = require('../models/Route');
const { auth, adminAuth, adminOrCommunityAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/routes
// @desc    Get all routes (admin) or routes for user's community
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let routes;
    
    if (req.user.role === 'admin') {
      // Admin can see all routes
      routes = await Route.find()
        .populate('community', 'name address')
        .populate('driver', 'name email phone')
        .sort({ createdAt: -1 });
    } else {
      // Regular users can only see routes for their community
      routes = await Route.find({ community: req.user.community })
        .populate('community', 'name address')
        .populate('driver', 'name email phone');
    }

    res.json({
      success: true,
      data: { routes }
    });

  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get routes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/routes/:id
// @desc    Get route by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('community', 'name address')
      .populate('driver', 'name email phone');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check if user can access this route
    if (req.user.role !== 'admin' && route.community._id.toString() !== req.user.community.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { route }
    });

  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get route',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/routes
// @desc    Create new route
// @access  Admin
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Route name must be between 2-100 characters'),
  body('community').isMongoId().withMessage('Valid community ID is required'),
  body('schedule.days').isArray({ min: 1 }).withMessage('At least one day must be selected'),
  body('schedule.time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('wasteTypes').isArray({ min: 1 }).withMessage('At least one waste type must be selected'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const routeData = {
      ...req.body,
      createdBy: req.user.id,
      status: 'active'
    };

    const route = new Route(routeData);
    await route.save();

    await route.populate('community', 'name address');
    await route.populate('driver', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: { route }
    });

  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create route',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/routes/:id
// @desc    Update route
// @access  Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'description', 'schedule', 'wasteTypes', 'stops', 'driver', 'vehicle', 'status'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(route, updates);
    route.updatedAt = new Date();
    await route.save();

    await route.populate('community', 'name address');
    await route.populate('driver', 'name email phone');

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: { route }
    });

  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/routes/:id
// @desc    Delete route
// @access  Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    await Route.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });

  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete route',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
