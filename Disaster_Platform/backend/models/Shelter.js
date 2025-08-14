const mongoose = require('mongoose');

const ShelterSchema = new mongoose.Schema({
    location: String,
    latitude: Number, // NEW
    longitude: Number, // NEW
    totalCapacity: Number,
    inmates: { type: Number, default: 0 },
    contactDetails: String,
    assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    available: { type: Boolean, default: true }
});

ShelterSchema.pre('save', function (next) {
    this.available = this.inmates < this.totalCapacity;
    next();
});

module.exports = mongoose.model('Shelter', ShelterSchema);
