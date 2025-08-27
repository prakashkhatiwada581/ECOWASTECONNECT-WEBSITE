const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  issueId: {
    type: String,
    unique: true,
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Community is required']
  },
  type: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: ['missed_pickup', 'overflowing_bin', 'damaged_bin', 'illegal_dumping', 'vehicle_issue', 'route_problem', 'other']
  },
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true }
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    landmark: { type: String, trim: true }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'acknowledged', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  category: {
    type: String,
    enum: ['collection', 'equipment', 'environmental', 'service', 'complaint', 'suggestion'],
    default: 'service'
  },
  images: [{
    url: { type: String, required: true },
    description: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number },
    mimeType: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  updates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    statusChange: {
      from: { type: String },
      to: { type: String }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  resolution: {
    solution: {
      type: String,
      trim: true,
      maxlength: [1000, 'Solution cannot exceed 1000 characters']
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: {
      type: Date
    }
  },
  feedback: {
    satisfied: {
      type: Boolean
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback comment cannot exceed 500 characters']
    },
    submittedAt: {
      type: Date
    }
  },
  relatedPickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metadata: {
    source: { type: String, default: 'web' }, // 'web', 'mobile', 'phone', 'email'
    ipAddress: { type: String },
    userAgent: { type: String },
    urgency: { type: Number, min: 1, max: 10, default: 5 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
issueSchema.index({ issueId: 1 });
issueSchema.index({ reporter: 1, createdAt: -1 });
issueSchema.index({ community: 1, status: 1 });
issueSchema.index({ assignedTo: 1, status: 1 });
issueSchema.index({ type: 1, priority: 1 });
issueSchema.index({ status: 1, createdAt: -1 });

// Virtual for full location
issueSchema.virtual('fullLocation').get(function() {
  if (!this.location || !this.location.address) return '';
  const { street, city, state, zipCode } = this.location.address;
  return [street, city, state, zipCode].filter(Boolean).join(', ');
});

// Virtual for age in days
issueSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for resolution time
issueSchema.virtual('resolutionTime').get(function() {
  if (!this.resolution.resolvedAt) return null;
  return Math.floor((this.resolution.resolvedAt - this.createdAt) / (1000 * 60 * 60)); // in hours
});

// Pre-save middleware to generate issue ID
issueSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the count of issues created today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    const todayCount = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    
    const sequence = (todayCount + 1).toString().padStart(3, '0');
    this.issueId = `ISS${year}${month}${day}${sequence}`;
  }
  
  // Update resolution details when status changes to resolved
  if (this.isModified('status') && this.status === 'resolved' && !this.resolution.resolvedAt) {
    this.resolution.resolvedAt = new Date();
  }
  
  next();
});

// Method to add update
issueSchema.methods.addUpdate = async function(userId, message, statusChange = null, isInternal = false) {
  const update = {
    user: userId,
    message,
    statusChange,
    isInternal,
    createdAt: new Date()
  };
  
  this.updates.push(update);
  
  if (statusChange) {
    this.status = statusChange.to;
  }
  
  await this.save();
  return this;
};

// Method to resolve issue
issueSchema.methods.resolve = async function(userId, solution, followUpRequired = false, followUpDate = null) {
  this.status = 'resolved';
  this.resolution = {
    solution,
    resolvedBy: userId,
    resolvedAt: new Date(),
    followUpRequired,
    followUpDate
  };
  
  await this.addUpdate(userId, `Issue resolved: ${solution}`, {
    from: this.status,
    to: 'resolved'
  });
  
  return this;
};

// Static method to get issue statistics
issueSchema.statics.getStatistics = async function(filter = {}) {
  const matchStage = { ...filter };
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIssues: { $sum: 1 },
        newIssues: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        inProgressIssues: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        resolvedIssues: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        closedIssues: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        averageRating: { $avg: '$feedback.rating' },
        highPriorityIssues: { $sum: { $cond: [{ $in: ['$priority', ['high', 'urgent']] }, 1, 0] } }
      }
    }
  ]);
  
  const result = stats[0] || {
    totalIssues: 0,
    newIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
    closedIssues: 0,
    averageRating: 0,
    highPriorityIssues: 0
  };
  
  // Calculate resolution rate
  result.resolutionRate = result.totalIssues > 0 
    ? Math.round(((result.resolvedIssues + result.closedIssues) / result.totalIssues) * 100)
    : 0;
    
  return result;
};

// Static method to get issues by type
issueSchema.statics.getByType = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] } }
      }
    },
    {
      $project: {
        type: '$_id',
        count: 1,
        resolved: 1,
        resolutionRate: {
          $round: [{
            $multiply: [
              { $divide: ['$resolved', '$count'] },
              100
            ]
          }]
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Issue', issueSchema);
