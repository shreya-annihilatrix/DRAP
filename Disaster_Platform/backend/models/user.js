const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ["admin", "volunteer", "public"], required: true },
  photo: { type: String, required: true }, // File path
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
