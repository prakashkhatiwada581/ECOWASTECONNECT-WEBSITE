const express = require('express');
const { body, validationResult } = require('express-validator');
const Community = require('../models/Community');
const { auth, adminAuth, adminOrCommunityAuth, communityAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/communities
// @desc    Get all communities (admin) or user's community
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let communities;
    
    if (req.user.role === 'admin') {
      // Admin can see all communities
      communities = await Community.find()
        .populate('admin', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Regular users can only see their own community
      communities = await Community.find({ _id: req.user.community })
        .populate('admin', 'name email');
    }

    res.json({
      success: true,
      data: { communities }
    });

  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get communities',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/communities/:id
// @desc    Get community by ID
// @access  Private
router.get('/:id', auth, communityAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('admin', 'name email phone');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.json({
      success: true,
      data: { community }
    });

  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get community',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/communities
// @desc    Create new community
// @access  Admin
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Community name must be between 2-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
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

    const { name, description, address, pickupSchedule } = req.body;

    // Check if community with same name already exists
    const existingCommunity = await Community.findOne({ 
      name: { $regex: new RegExp(name, 'i') } 
    });

    if (existingCommunity) {
      return res.status(400).json({
        success: false,
        message: 'Community with this name already exists'
      });
    }

    const community = new Community({
      name,
      description,
      address,
      admin: req.user.id,
      pickupSchedule: pickupSchedule || {
        general: { days: ['monday', 'wednesday', 'friday'], time: '08:00' },
        recycling: { days: ['tuesday', 'saturday'], time: '09:00' },
        organic: { days: ['thursday'], time: '10:00' }
      },
      status: 'active'
    });

    await community.save();

    res.status(201).json({
      success: true,
      message: 'Community created successfully',
      data: { community }
    });

  } catch (error) {
    console.error('Create community error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create community',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/communities/:id
// @desc    Update community
// @access  Admin or Community Admin
router.put('/:id', adminOrCommunityAuth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Community name must be between 2-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
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

    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'description', 'address', 'pickupSchedule', 'status'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(community, updates);
    await community.save();

    res.json({
      success: true,
      message: 'Community updated successfully',
      data: { community }
    });

  } catch (error) {
    console.error('Update community error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update community',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/communities/:id
// @desc    Delete community
// @access  Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    await Community.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Community deleted successfully'
    });

  } catch (error) {
    console.error('Delete community error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete community',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
