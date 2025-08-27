const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Community is required']
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    default: null
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: ['morning', 'afternoon', 'evening']
  },
  wasteType: {
    type: String,
    required: [true, 'Waste type is required'],
    enum: ['general', 'recyclable', 'organic', 'hazardous', 'electronic']
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'missed'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  estimatedWeight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    default: 0
  },
  actualWeight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    default: null
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  vehicle: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  images: [{
    url: { type: String, required: true },
    description: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback comment cannot exceed 1000 characters']
    },
    submittedAt: { type: Date }
  },
  metadata: {
    createdBy: { type: String, default: 'user' }, // 'user', 'admin', 'system'
    source: { type: String, default: 'web' }, // 'web', 'mobile', 'api'
    ipAddress: { type: String },
    userAgent: { type: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
pickupSchema.index({ user: 1, scheduledDate: -1 });
pickupSchema.index({ community: 1, status: 1 });
pickupSchema.index({ route: 1, scheduledDate: 1 });
pickupSchema.index({ status: 1, scheduledDate: 1 });
pickupSchema.index({ wasteType: 1 });

// Virtual for full address
pickupSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, zipCode } = this.address;
  return [street, city, state, zipCode].filter(Boolean).join(', ');
});

// Virtual for time slot display
pickupSchema.virtual('timeSlotDisplay').get(function() {
  const timeSlots = {
    morning: '8:00 AM - 12:00 PM',
    afternoon: '12:00 PM - 4:00 PM',
    evening: '4:00 PM - 8:00 PM'
  };
  return timeSlots[this.timeSlot] || this.timeSlot;
});

// Virtual for status display
pickupSchema.virtual('statusDisplay').get(function() {
  const statusLabels = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    missed: 'Missed'
  };
  return statusLabels[this.status] || this.status;
});

// Pre-save middleware
pickupSchema.pre('save', function(next) {
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Clear completedAt if status is not completed
  if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = null;
  }
  
  next();
});

// Static method to get pickup statistics
pickupSchema.statics.getStatistics = async function(filter = {}) {
  const matchStage = { ...filter };
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPickups: { $sum: 1 },
        completedPickups: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        scheduledPickups: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
        cancelledPickups: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        missedPickups: { $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] } },
        totalWeight: { $sum: { $ifNull: ['$actualWeight', '$estimatedWeight'] } },
        averageRating: { $avg: '$feedback.rating' }
      }
    }
  ]);
  
  const result = stats[0] || {
    totalPickups: 0,
    completedPickups: 0,
    scheduledPickups: 0,
    cancelledPickups: 0,
    missedPickups: 0,
    totalWeight: 0,
    averageRating: 0
  };
  
  // Calculate efficiency
  result.efficiency = result.totalPickups > 0 
    ? Math.round((result.completedPickups / result.totalPickups) * 100)
    : 0;
    
  return result;
};

// Static method to get pickups by date range
pickupSchema.statics.getByDateRange = function(startDate, endDate, filter = {}) {
  return this.find({
    ...filter,
    scheduledDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
  .populate('user', 'name email')
  .populate('community', 'name')
  .populate('driver', 'name')
  .sort({ scheduledDate: 1 });
};

// Method to mark as completed
pickupSchema.methods.markCompleted = async function(driverData = {}) {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (driverData.driver) this.driver = driverData.driver;
  if (driverData.vehicle) this.vehicle = driverData.vehicle;
  if (driverData.actualWeight) this.actualWeight = driverData.actualWeight;
  
  await this.save();
  return this;
};

// Method to cancel pickup
pickupSchema.methods.cancel = async function(reason = '') {
  this.status = 'cancelled';
  if (reason) {
    this.notes = (this.notes ? this.notes + '\n' : '') + `Cancelled: ${reason}`;
  }
  await this.save();
  return this;
};

module.exports = mongoose.model('Pickup', pickupSchema);
