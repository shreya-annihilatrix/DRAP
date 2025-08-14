const mongoose = require("mongoose");

const inmateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  age: { type: Number, required: true },
  contact: { type: String, required: true },
  shelterId: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true }
});

module.exports = mongoose.model("Inmate", inmateSchema);
