const mongoose = require('mongoose');

const ResourceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('ResourceType', ResourceTypeSchema);
