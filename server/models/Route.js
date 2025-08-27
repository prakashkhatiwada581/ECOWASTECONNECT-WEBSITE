const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true,
    maxlength: [100, 'Route name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  communities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  }],
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Driver is required']
  },
  vehicle: {
    vehicleId: {
      type: String,
      required: [true, 'Vehicle ID is required'],
      trim: true,
      uppercase: true
    },
    type: {
      type: String,
      enum: ['truck', 'van', 'compactor', 'recycling_truck'],
      default: 'truck'
    },
    capacity: {
      type: Number,
      min: [0, 'Capacity cannot be negative'],
      default: 0 // in cubic meters or tons
    },
    plateNumber: {
      type: String,
      trim: true,
      uppercase: true
    }
  },
  schedule: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    }],
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
    },
    estimatedDuration: {
      type: Number, // in minutes
      min: [0, 'Duration cannot be negative']
    }
  },
  wasteTypes: [{
    type: String,
    enum: ['general', 'recyclable', 'organic', 'hazardous', 'electronic'],
    required: true
  }],
  waypoints: [{
    order: {
      type: Number,
      required: true,
      min: [1, 'Order must be at least 1']
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true }
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    estimatedTime: { type: Number }, // minutes to spend at this location
    notes: { type: String, trim: true }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'suspended'],
    default: 'active'
  },
  metrics: {
    totalPickups: { type: Number, default: 0 },
    completedPickups: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 }, // in minutes
    efficiency: { type: Number, default: 100 }, // percentage
    fuelConsumption: { type: Number, default: 0 }, // liters per 100km
    maintenanceCost: { type: Number, default: 0 },
    lastRun: { type: Date }
  },
  rules: {
    maxPickupsPerDay: { type: Number, default: 50 },
    maxWeightPerDay: { type: Number, default: 1000 }, // in kg
    requireSignature: { type: Boolean, default: false },
    allowSpecialRequests: { type: Boolean, default: true }
  },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
routeSchema.index({ name: 1 });
routeSchema.index({ driver: 1 });
routeSchema.index({ communities: 1 });
routeSchema.index({ status: 1 });
routeSchema.index({ 'schedule.days': 1 });

// Virtual for schedule display
routeSchema.virtual('scheduleDisplay').get(function() {
  if (!this.schedule.days || this.schedule.days.length === 0) return '';
  
  const dayNames = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
  };
  
  const days = this.schedule.days.map(day => dayNames[day]).join(', ');
  return `${days} (${this.schedule.startTime} - ${this.schedule.endTime})`;
});

// Virtual for efficiency rating
routeSchema.virtual('efficiencyRating').get(function() {
  if (this.metrics.totalPickups === 0) return 'N/A';
  const efficiency = (this.metrics.completedPickups / this.metrics.totalPickups) * 100;
  return `${Math.round(efficiency)}%`;
});

// Virtual for total distance (calculated from waypoints)
routeSchema.virtual('estimatedDistance').get(function() {
  if (!this.waypoints || this.waypoints.length < 2) return 0;
  
  // Simple distance calculation between consecutive waypoints
  // In a real application, you'd use a proper mapping service
  let totalDistance = 0;
  for (let i = 1; i < this.waypoints.length; i++) {
    const prev = this.waypoints[i - 1].coordinates;
    const curr = this.waypoints[i].coordinates;
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
    const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    totalDistance += distance;
  }
  
  return Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
});

// Pre-save middleware to validate schedule
routeSchema.pre('save', function(next) {
  // Validate that end time is after start time
  if (this.schedule.startTime && this.schedule.endTime) {
    const [startHour, startMin] = this.schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = this.schedule.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      return next(new Error('End time must be after start time'));
    }
    
    // Calculate estimated duration if not provided
    if (!this.schedule.estimatedDuration) {
      this.schedule.estimatedDuration = endMinutes - startMinutes;
    }
  }
  
  // Sort waypoints by order
  if (this.waypoints && this.waypoints.length > 0) {
    this.waypoints.sort((a, b) => a.order - b.order);
  }
  
  next();
});

// Method to update metrics
routeSchema.methods.updateMetrics = async function(pickupData = {}) {
  try {
    const Pickup = mongoose.model('Pickup');
    
    // Get pickup statistics for this route
    const stats = await Pickup.aggregate([
      { $match: { route: this._id } },
      {
        $group: {
          _id: null,
          totalPickups: { $sum: 1 },
          completedPickups: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          averageTime: { $avg: '$metadata.processingTime' }
        }
      }
    ]);
    
    if (stats.length > 0) {
      this.metrics.totalPickups = stats[0].totalPickups;
      this.metrics.completedPickups = stats[0].completedPickups;
      this.metrics.averageTime = Math.round(stats[0].averageTime || 0);
      this.metrics.efficiency = this.metrics.totalPickups > 0 
        ? Math.round((this.metrics.completedPickups / this.metrics.totalPickups) * 100)
        : 100;
    }
    
    // Update last run if provided
    if (pickupData.lastRun) {
      this.metrics.lastRun = pickupData.lastRun;
    }
    
    await this.save();
    return this.metrics;
  } catch (error) {
    console.error('Error updating route metrics:', error);
    throw error;
  }
};

// Method to check availability for a given date and time
routeSchema.methods.isAvailable = function(date, timeSlot) {
  const dayOfWeek = date.toLocaleLowerCase();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = dayNames[date.getDay()];
  
  // Check if route operates on this day
  if (!this.schedule.days.includes(targetDay)) {
    return false;
  }
  
  // Check if route is active
  if (this.status !== 'active') {
    return false;
  }
  
  // Additional time slot validation could be added here
  return true;
};

// Static method to find available routes
routeSchema.statics.findAvailable = function(date, wasteType, community) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = dayNames[date.getDay()];
  
  const query = {
    status: 'active',
    'schedule.days': targetDay,
    wasteTypes: wasteType
  };
  
  if (community) {
    query.communities = community;
  }
  
  return this.find(query)
    .populate('driver', 'name phone email')
    .populate('communities', 'name')
    .sort({ 'schedule.startTime': 1 });
};

// Static method to get route statistics
routeSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalRoutes: { $sum: 1 },
        activeRoutes: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        maintenanceRoutes: { $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] } },
        averageEfficiency: { $avg: '$metrics.efficiency' },
        totalPickups: { $sum: '$metrics.totalPickups' },
        completedPickups: { $sum: '$metrics.completedPickups' }
      }
    }
  ]);
  
  return stats[0] || {
    totalRoutes: 0,
    activeRoutes: 0,
    maintenanceRoutes: 0,
    averageEfficiency: 0,
    totalPickups: 0,
    completedPickups: 0
  };
};

module.exports = mongoose.model('Route', routeSchema);
