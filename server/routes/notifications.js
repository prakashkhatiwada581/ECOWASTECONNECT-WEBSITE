const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// In-memory storage for demo purposes
// In production, you would use a proper database collection
let notifications = [
  {
    id: '1',
    title: 'Pickup Confirmed',
    message: 'Your recyclables pickup for 2023-11-02 has been successfully scheduled.',
    time: '2 hours ago',
    type: 'success',
    isRead: false,
    userId: null, // null means for all users
    isForAdmin: false,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Issue Resolved',
    message: 'The reported issue regarding overflowing bins at Park Ave has been resolved.',
    time: '1 day ago',
    type: 'info',
    isRead: false,
    userId: null,
    isForAdmin: false,
    createdAt: new Date()
  }
];

// @route   GET /api/notifications
// @desc    Get notifications for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, isRead } = req.query;
    
    // Filter notifications based on user role and specific user
    let userNotifications = notifications.filter(notification => {
      // Admin notifications
      if (req.user.role === 'admin' && notification.isForAdmin) {
        return true;
      }
      
      // User notifications (either global or specific to user)
      if (!notification.isForAdmin && (notification.userId === null || notification.userId === req.user.id)) {
        return true;
      }
      
      return false;
    });

    // Apply additional filters
    if (type) {
      userNotifications = userNotifications.filter(n => n.type === type);
    }
    
    if (isRead !== undefined) {
      userNotifications = userNotifications.filter(n => n.isRead === (isRead === 'true'));
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: { 
        notifications: userNotifications,
        unreadCount: userNotifications.filter(n => !n.isRead).length
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification (admin only)
// @access  Admin
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1-500 characters'),
  body('type').isIn(['success', 'warning', 'info', 'error']).withMessage('Invalid notification type'),
  body('isForAdmin').optional().isBoolean().withMessage('isForAdmin must be a boolean'),
  body('userId').optional().isString().withMessage('userId must be a string')
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

    const { title, message, type, isForAdmin = false, userId = null } = req.body;

    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      time: 'Just now',
      isRead: false,
      userId,
      isForAdmin,
      createdAt: new Date()
    };

    notifications.unshift(notification);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = notifications.find(n => n.id === req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user can access this notification
    const canAccess = (
      (req.user.role === 'admin' && notification.isForAdmin) ||
      (!notification.isForAdmin && (notification.userId === null || notification.userId === req.user.id))
    );

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    notification.isRead = true;

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read for current user
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    let updatedCount = 0;

    notifications.forEach(notification => {
      // Check if user can access this notification and it's unread
      const canAccess = (
        (req.user.role === 'admin' && notification.isForAdmin) ||
        (!notification.isForAdmin && (notification.userId === null || notification.userId === req.user.id))
      );

      if (canAccess && !notification.isRead) {
        notification.isRead = true;
        updatedCount++;
      }
    });

    res.json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      data: { updatedCount }
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (admin only)
// @access  Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notifications.splice(notificationIndex, 1);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics (admin only)
// @access  Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byType: {
        success: notifications.filter(n => n.type === 'success').length,
        warning: notifications.filter(n => n.type === 'warning').length,
        info: notifications.filter(n => n.type === 'info').length,
        error: notifications.filter(n => n.type === 'error').length
      },
      adminNotifications: notifications.filter(n => n.isForAdmin).length,
      userNotifications: notifications.filter(n => !n.isForAdmin).length
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
