const mongoose = require('mongoose');

const FoodTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  shelter: { type: String, required: true }
});

module.exports = mongoose.model('FoodTask', FoodTaskSchema);
