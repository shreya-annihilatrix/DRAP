const mongoose = require('mongoose');

const TaskTypeSchema = new mongoose.Schema({
  typeId: { type: Number, required: true, unique: true }, // Unique integer ID for each task type
  name: { type: String, required: true, unique: true } // Unique task type name
});

module.exports = mongoose.model('TaskType', TaskTypeSchema);
