const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Community name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, default: 'USA' }
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Community admin is required']
  },
  pickupSchedule: {
    general: {
      days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
      time: { type: String, required: true } // Format: "HH:MM"
    },
    recycling: {
      days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
      time: { type: String, required: true }
    },
    organic: {
      days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
      time: { type: String, required: true }
    }
  },
  serviceAreas: [{
    name: { type: String, required: true },
    boundaries: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon'
      },
      coordinates: [[[Number]]]
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  statistics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    wasteCollected: { type: Number, default: 0 }, // in tons
    recyclingRate: { type: Number, default: 0 }, // percentage
    issuesReported: { type: Number, default: 0 },
    issuesResolved: { type: Number, default: 0 }
  },
  settings: {
    allowUserRegistration: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    enableNotifications: { type: Boolean, default: true },
    timezone: { type: String, default: 'UTC' }
  },
  contactInfo: {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
communitySchema.index({ name: 1 });
communitySchema.index({ status: 1 });
communitySchema.index({ 'address.city': 1, 'address.state': 1 });

// Virtual for full address
communitySchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, zipCode } = this.address;
  return [street, city, state, zipCode].filter(Boolean).join(', ');
});

// Virtual for efficiency rating
communitySchema.virtual('efficiency').get(function() {
  if (this.statistics.issuesReported === 0) return 100;
  return Math.round((this.statistics.issuesResolved / this.statistics.issuesReported) * 100);
});

// Pre-save middleware to update user count
communitySchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('status')) {
    try {
      const User = mongoose.model('User');
      const userCount = await User.countDocuments({ 
        community: this._id, 
        isActive: true 
      });
      this.statistics.totalUsers = userCount;
      this.statistics.activeUsers = userCount; // Simplified - could be more complex
    } catch (error) {
      console.error('Error updating user count:', error);
    }
  }
  next();
});

// Static method to get community statistics
communitySchema.statics.getOverallStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCommunities: { $sum: 1 },
        activeCommunities: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        pendingCommunities: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        totalWasteCollected: { $sum: '$statistics.wasteCollected' },
        averageRecyclingRate: { $avg: '$statistics.recyclingRate' },
        totalIssues: { $sum: '$statistics.issuesReported' },
        resolvedIssues: { $sum: '$statistics.issuesResolved' }
      }
    }
  ]);
  
  return stats[0] || {
    totalCommunities: 0,
    activeCommunities: 0,
    pendingCommunities: 0,
    totalWasteCollected: 0,
    averageRecyclingRate: 0,
    totalIssues: 0,
    resolvedIssues: 0
  };
};

// Method to update statistics
communitySchema.methods.updateStatistics = async function() {
  try {
    const User = mongoose.model('User');
    const Issue = mongoose.model('Issue');
    const Pickup = mongoose.model('Pickup');
    
    // Update user counts
    const totalUsers = await User.countDocuments({ community: this._id });
    const activeUsers = await User.countDocuments({ community: this._id, isActive: true });
    
    // Update issue counts
    const issuesReported = await Issue.countDocuments({ community: this._id });
    const issuesResolved = await Issue.countDocuments({ 
      community: this._id, 
      status: 'resolved' 
    });
    
    // Update waste collection data
    const wasteData = await Pickup.aggregate([
      { $match: { community: this._id, status: 'completed' } },
      { $group: { _id: null, totalWeight: { $sum: '$estimatedWeight' } } }
    ]);
    
    this.statistics = {
      totalUsers,
      activeUsers,
      wasteCollected: wasteData[0]?.totalWeight || 0,
      recyclingRate: this.statistics.recyclingRate, // Keep existing or calculate
      issuesReported,
      issuesResolved
    };
    
    await this.save();
    return this.statistics;
  } catch (error) {
    console.error('Error updating community statistics:', error);
    throw error;
  }
};

module.exports = mongoose.model('Community', communitySchema);
