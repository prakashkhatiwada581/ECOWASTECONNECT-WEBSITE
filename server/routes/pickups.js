const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Pickup = require('../models/Pickup');
const Community = require('../models/Community');
const Route = require('../models/Route');
const { auth, adminAuth, ownerOrAdminAuth, communityAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/pickups
// @desc    Get all pickups (with filtering)
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  query('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled', 'missed']),
  query('wasteType').optional().isIn(['general', 'recyclable', 'organic', 'hazardous', 'electronic']),
  query('community').optional().isMongoId().withMessage('Invalid community ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
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

    const {
      page = 1,
      limit = 10,
      status,
      wasteType,
      community,
      startDate,
      endDate,
      user
    } = req.query;

    // Build filter query
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'user') {
      filter.user = req.user.id;
    } else if (req.user.role === 'community_admin' && req.user.community) {
      filter.community = req.user.community;
    }

    // Apply additional filters
    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;
    if (community && (req.user.role === 'admin' || req.user.community.toString() === community)) {
      filter.community = community;
    }
    if (user && req.user.role === 'admin') filter.user = user;

    // Date range filter
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get pickups with population
    const pickups = await Pickup.find(filter)
      .populate('user', 'name email phone')
      .populate('community', 'name address')
      .populate('route', 'name driver vehicle')
      .populate('driver', 'name phone')
      .sort({ scheduledDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Pickup.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        pickups,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pickups',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/pickups/:id
// @desc    Get pickup by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('community', 'name address pickupSchedule')
      .populate('route', 'name driver vehicle schedule')
      .populate('driver', 'name phone email');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && pickup.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'community_admin' && pickup.community._id.toString() !== req.user.community.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { pickup }
    });

  } catch (error) {
    console.error('Get pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pickup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/pickups
// @desc    Create new pickup
// @access  Private
router.post('/', auth, [
  body('scheduledDate').isISO8601().withMessage('Please provide a valid scheduled date'),
  body('timeSlot').isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid time slot'),
  body('wasteType').isIn(['general', 'recyclable', 'organic', 'hazardous', 'electronic']).withMessage('Invalid waste type'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  body('estimatedWeight').optional().isNumeric().withMessage('Estimated weight must be a number')
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

    // Get user's community
    const userCommunity = req.user.community;
    if (!userCommunity && req.user.role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'User must be associated with a community'
      });
    }

    const pickupData = {
      ...req.body,
      user: req.user.id,
      community: userCommunity || req.body.community,
      metadata: {
        createdBy: 'user',
        source: 'web',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    };

    // Check if scheduled date is in the future
    const scheduledDate = new Date(req.body.scheduledDate);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date must be in the future'
      });
    }

    // Try to find an available route
    const availableRoutes = await Route.findAvailable(
      scheduledDate,
      req.body.wasteType,
      userCommunity
    );

    if (availableRoutes.length > 0) {
      pickupData.route = availableRoutes[0]._id;
    }

    const pickup = new Pickup(pickupData);
    await pickup.save();

    // Populate the response
    await pickup.populate([
      { path: 'user', select: 'name email' },
      { path: 'community', select: 'name address' },
      { path: 'route', select: 'name driver vehicle' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Pickup scheduled successfully',
      data: { pickup }
    });

  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pickup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/pickups/:id
// @desc    Update pickup
// @access  Private
router.put('/:id', auth, [
  body('scheduledDate').optional().isISO8601().withMessage('Please provide a valid scheduled date'),
  body('timeSlot').optional().isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid time slot'),
  body('wasteType').optional().isIn(['general', 'recyclable', 'organic', 'hazardous', 'electronic']).withMessage('Invalid waste type'),
  body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled', 'missed']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  body('estimatedWeight').optional().isNumeric().withMessage('Estimated weight must be a number'),
  body('actualWeight').optional().isNumeric().withMessage('Actual weight must be a number')
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

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && pickup.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'community_admin' && pickup.community.toString() !== req.user.community.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Users can only update certain fields
    const allowedUserUpdates = ['scheduledDate', 'timeSlot', 'wasteType', 'notes', 'estimatedWeight', 'address'];
    const allowedAdminUpdates = [...allowedUserUpdates, 'status', 'route', 'driver', 'vehicle', 'actualWeight', 'priority'];

    const allowedUpdates = req.user.role === 'admin' ? allowedAdminUpdates : allowedUserUpdates;
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate scheduled date if being updated
    if (updates.scheduledDate) {
      const scheduledDate = new Date(updates.scheduledDate);
      if (scheduledDate <= new Date() && pickup.status === 'scheduled') {
        return res.status(400).json({
          success: false,
          message: 'Scheduled date must be in the future'
        });
      }
    }

    // Apply updates
    Object.assign(pickup, updates);
    await pickup.save();

    // Populate the response
    await pickup.populate([
      { path: 'user', select: 'name email' },
      { path: 'community', select: 'name address' },
      { path: 'route', select: 'name driver vehicle' },
      { path: 'driver', select: 'name phone' }
    ]);

    res.json({
      success: true,
      message: 'Pickup updated successfully',
      data: { pickup }
    });

  } catch (error) {
    console.error('Update pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pickup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/pickups/:id
// @desc    Delete/Cancel pickup
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && pickup.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'community_admin' && pickup.community.toString() !== req.user.community.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cancel instead of delete if pickup is not completed
    if (['scheduled', 'in_progress'].includes(pickup.status)) {
      await pickup.cancel('Cancelled by user');
      res.json({
        success: true,
        message: 'Pickup cancelled successfully',
        data: { pickup }
      });
    } else {
      // Admin can permanently delete
      if (req.user.role === 'admin') {
        await Pickup.findByIdAndDelete(req.params.id);
        res.json({
          success: true,
          message: 'Pickup deleted successfully'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete completed pickup'
        });
      }
    }

  } catch (error) {
    console.error('Delete pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pickup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/pickups/:id/complete
// @desc    Mark pickup as completed
// @access  Private (Admin/Driver)
router.post('/:id/complete', auth, [
  body('actualWeight').optional().isNumeric().withMessage('Actual weight must be a number'),
  body('driver').optional().isMongoId().withMessage('Invalid driver ID'),
  body('vehicle').optional().isString().withMessage('Vehicle must be a string'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Only admin or assigned driver can complete
    if (req.user.role !== 'admin' && pickup.driver?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const driverData = {
      driver: req.body.driver || req.user.id,
      vehicle: req.body.vehicle,
      actualWeight: req.body.actualWeight
    };

    await pickup.markCompleted(driverData);

    // Add completion notes if provided
    if (req.body.notes) {
      pickup.notes = (pickup.notes ? pickup.notes + '\n' : '') + `Completion notes: ${req.body.notes}`;
      await pickup.save();
    }

    await pickup.populate([
      { path: 'user', select: 'name email' },
      { path: 'community', select: 'name address' },
      { path: 'driver', select: 'name phone' }
    ]);

    res.json({
      success: true,
      message: 'Pickup marked as completed',
      data: { pickup }
    });

  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete pickup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/pickups/stats
// @desc    Get pickup statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate, community } = req.query;

    // Build filter based on user role
    const filter = {};
    
    if (req.user.role === 'user') {
      filter.user = req.user.id;
    } else if (req.user.role === 'community_admin' && req.user.community) {
      filter.community = req.user.community;
    } else if (community && req.user.role === 'admin') {
      filter.community = community;
    }

    // Add date filter if provided
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const stats = await Pickup.getStatistics(filter);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get pickup stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pickup statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
