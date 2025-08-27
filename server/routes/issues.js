const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const { auth, adminAuth, ownerOrAdminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/issues
// @desc    Get all issues (admin) or user's issues
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Demo mode when database is disconnected
    if (process.env.MONGODB_URI === undefined && process.env.NODE_ENV !== 'production') {
      console.log('📋 Demo mode: returning sample issues for', req.user.role);

      const demoIssues = [
        {
          _id: 'demo-issue-1',
          type: 'missed_pickup',
          title: 'Missed Recycling Pickup',
          description: 'Recycling bins were not collected on scheduled day',
          location: { address: '123 Main St, Downtown' },
          status: 'pending',
          priority: 'medium',
          user: { _id: req.user.id, name: req.user.name },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'demo-issue-2',
          type: 'overflowing_bin',
          title: 'Overflowing Garbage Bin',
          description: 'Garbage bin at the corner is overflowing and attracting pests',
          location: { address: '456 Oak Ave, Midtown' },
          status: 'in-progress',
          priority: 'high',
          user: { _id: req.user.id, name: req.user.name },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return res.json({
        success: true,
        data: { issues: demoIssues }
      });
    }

    let issues;
    const { status, type, community } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (community && req.user.role === 'admin') filter.community = community;

    if (req.user.role === 'admin') {
      // Admin can see all issues
      issues = await Issue.find(filter)
        .populate('user', 'name email')
        .populate('community', 'name')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Users can only see their own issues
      filter.user = req.user.id;
      issues = await Issue.find(filter)
        .populate('community', 'name')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      data: { issues }
    });

  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get issues',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/issues/:id
// @desc    Get issue by ID
// @access  Private (owner or admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('community', 'name address')
      .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user can access this issue
    if (req.user.role !== 'admin' && issue.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { issue }
    });

  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get issue',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/issues
// @desc    Create new issue
// @access  Private
router.post('/', auth, [
  body('type').isIn(['missed_pickup', 'damaged_bin', 'overflowing_bin', 'illegal_dumping', 'other']).withMessage('Invalid issue type'),
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10-1000 characters'),
  body('location.address').notEmpty().withMessage('Address is required'),
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

    // Demo mode when database is disconnected
    if (process.env.MONGODB_URI === undefined && process.env.NODE_ENV !== 'production') {
      console.log('📝 Demo mode: creating issue for', req.user.name);

      const demoIssue = {
        _id: `demo-issue-${Date.now()}`,
        ...req.body,
        user: { _id: req.user.id, name: req.user.name },
        status: 'pending',
        priority: req.body.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return res.status(201).json({
        success: true,
        message: 'Issue reported successfully (demo mode)',
        data: { issue: demoIssue }
      });
    }

    const issueData = {
      ...req.body,
      user: req.user.id,
      community: req.user.community,
      status: 'pending',
      priority: req.body.priority || 'medium'
    };

    const issue = new Issue(issueData);
    await issue.save();

    await issue.populate('user', 'name email');
    await issue.populate('community', 'name');

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: { issue }
    });

  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report issue',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/issues/:id
// @desc    Update issue
// @access  Admin or issue owner (limited fields)
router.put('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const isOwner = issue.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Define allowed updates based on role
    let allowedUpdates;
    if (isAdmin) {
      allowedUpdates = ['status', 'priority', 'assignedTo', 'notes', 'resolution'];
    } else {
      // Users can only update certain fields and only if issue is pending
      if (issue.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update issue after it has been processed'
        });
      }
      allowedUpdates = ['title', 'description', 'location'];
    }

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Add admin-specific updates
    if (isAdmin) {
      if (req.body.status === 'resolved') {
        updates.resolvedAt = new Date();
        updates.resolvedBy = req.user.id;
      }
      updates.lastUpdatedBy = req.user.id;
    }

    Object.assign(issue, updates);
    issue.updatedAt = new Date();
    await issue.save();

    await issue.populate('user', 'name email');
    await issue.populate('community', 'name');
    await issue.populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: { issue }
    });

  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/issues/:id
// @desc    Delete issue
// @access  Admin or issue owner (if pending)
router.delete('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const isOwner = issue.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Users can only delete pending issues
    if (!isAdmin && issue.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete issue after it has been processed'
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });

  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete issue',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/issues/:id/comments
// @desc    Add comment to issue
// @access  Private (owner or admin)
router.post('/:id/comments', auth, [
  body('comment').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1-500 characters')
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

    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const isOwner = issue.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const comment = {
      user: req.user.id,
      comment: req.body.comment,
      createdAt: new Date()
    };

    issue.comments.push(comment);
    await issue.save();

    await issue.populate('comments.user', 'name email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { issue }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
