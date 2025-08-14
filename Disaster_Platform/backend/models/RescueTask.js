const mongoose = require('mongoose');

const RescueTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }

});

module.exports = mongoose.model('RescueTask', RescueTaskSchema);
