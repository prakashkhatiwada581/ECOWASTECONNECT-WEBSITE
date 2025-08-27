const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Community = require('../models/Community');
const router = express.Router();

// @route   GET /api/settings/user
// @desc    Get user settings
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('preferences notifications')
      .populate('community', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const settings = {
      preferences: user.preferences || {
        language: 'en',
        timezone: 'UTC',
        theme: 'light',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      notifications: {
        pickupReminders: true,
        issueUpdates: true,
        communityNews: true,
        systemUpdates: true,
        frequency: 'daily'
      },
      privacy: {
        profileVisibility: 'community',
        dataSharing: false,
        analytics: true
      }
    };

    res.json({
      success: true,
      data: { settings }
    });

  } catch (error) {
    console.error('Get user settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/settings/user
// @desc    Update user settings
// @access  Private
router.put('/user', auth, [
  body('preferences.language').optional().isIn(['en', 'es', 'fr', 'de']).withMessage('Invalid language'),
  body('preferences.theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Invalid theme'),
  body('preferences.notifications.email').optional().isBoolean(),
  body('preferences.notifications.sms').optional().isBoolean(),
  body('preferences.notifications.push').optional().isBoolean(),
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

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    // Update notification settings
    if (req.body.notifications) {
      user.notifications = { ...user.notifications, ...req.body.notifications };
    }

    // Update privacy settings
    if (req.body.privacy) {
      user.privacy = { ...user.privacy, ...req.body.privacy };
    }

    await user.save();

    res.json({
      success: true,
      message: 'User settings updated successfully',
      data: { 
        preferences: user.preferences,
        notifications: user.notifications,
        privacy: user.privacy
      }
    });

  } catch (error) {
    console.error('Update user settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/settings/system
// @desc    Get system settings (admin only)
// @access  Admin
router.get('/system', adminAuth, async (req, res) => {
  try {
    // Mock system settings - in production, these would be stored in database
    const systemSettings = {
      general: {
        siteName: 'EcoWasteConnect',
        siteDescription: 'Smart waste management for connected communities',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: false
      },
      notifications: {
        emailSettings: {
          enabled: true,
          smtpHost: 'smtp.example.com',
          smtpPort: 587,
          smtpSecure: true,
          fromName: 'EcoWasteConnect',
          fromEmail: 'noreply@ecowasteconnect.com'
        },
        smsSettings: {
          enabled: false,
          provider: 'twilio',
          fromNumber: '+1234567890'
        },
        pushSettings: {
          enabled: true,
          webPushEnabled: true,
          mobileEnabled: true
        }
      },
      backup: {
        enabled: true,
        frequency: 'daily',
        retention: 30, // days
        lastBackup: '2024-01-01T00:00:00Z'
      },
      security: {
        passwordMinLength: 6,
        passwordRequireSpecialChar: false,
        sessionTimeout: 24, // hours
        maxLoginAttempts: 5,
        twoFactorEnabled: false
      },
      analytics: {
        enabled: true,
        retentionPeriod: 365, // days
        anonymizeData: true,
        exportEnabled: true
      }
    };

    res.json({
      success: true,
      data: { settings: systemSettings }
    });

  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/settings/system
// @desc    Update system settings (admin only)
// @access  Admin
router.put('/system', adminAuth, [
  body('general.siteName').optional().trim().isLength({ min: 1, max: 100 }),
  body('general.maintenanceMode').optional().isBoolean(),
  body('general.registrationEnabled').optional().isBoolean(),
  body('notifications.emailSettings.enabled').optional().isBoolean(),
  body('backup.enabled').optional().isBoolean(),
  body('security.passwordMinLength').optional().isInt({ min: 6, max: 50 }),
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

    // In production, you would update these settings in the database
    // For demo purposes, we'll just return success
    
    res.json({
      success: true,
      message: 'System settings updated successfully',
      data: { settings: req.body }
    });

  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/settings/community/:id
// @desc    Get community settings
// @access  Admin or Community Admin
router.get('/community/:id', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && community.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const settings = {
      basic: {
        name: community.name,
        description: community.description,
        address: community.address,
        status: community.status
      },
      pickupSchedule: community.pickupSchedule,
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24, // hours before pickup
        issueAlerts: true
      },
      features: {
        onlinePayments: false,
        specialPickups: true,
        recyclingRewards: false,
        communityForum: true
      }
    };

    res.json({
      success: true,
      data: { settings }
    });

  } catch (error) {
    console.error('Get community settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get community settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/settings/community/:id
// @desc    Update community settings
// @access  Admin or Community Admin
router.put('/community/:id', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && community.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'description', 'pickupSchedule', 'status'];
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
      message: 'Community settings updated successfully',
      data: { community }
    });

  } catch (error) {
    console.error('Update community settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update community settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/settings/app-info
// @desc    Get application information
// @access  Public
router.get('/app-info', async (req, res) => {
  try {
    const appInfo = {
      name: 'EcoWasteConnect',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: [
        'Smart waste scheduling',
        'Community management',
        'Issue tracking',
        'Analytics and reporting',
        'Environmental impact tracking'
      ],
      supportContact: {
        email: 'support@ecowasteconnect.com',
        phone: '+1-800-ECO-WASTE'
      },
      privacy: {
        policyUrl: '/privacy-policy',
        termsUrl: '/terms-of-service'
      }
    };

    res.json({
      success: true,
      data: { appInfo }
    });

  } catch (error) {
    console.error('Get app info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get application information',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
