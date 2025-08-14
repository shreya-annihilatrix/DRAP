const mongoose = require('mongoose');

const TaskProgressSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  progressDescription: { type: String, required: true },
  progressPercentage: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  
  // Transportation specific fields
  deliveryStatus: { type: String, enum: ['Not Started', 'In Transit', 'Delivered'], default: 'Not Started' },
  
  // Food service specific fields
  mealsServed: { type: Number, default: 0 },
  
  // Rescue operation management specific fields
  peopleFound: { type: Number, default: 0 },
  peopleHospitalized: { type: Number, default: 0 },
  peopleMissing: { type: Number, default: 0 },
  peopleLost: { type: Number, default: 0 },
  
  // Additional updates can be stored as an array of updates
  updates: [{
    description: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('TaskProgress', TaskProgressSchema);