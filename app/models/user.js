const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Change type to String for passwords
    role: { type: String, default: 'customer' }
}, { timestamps: true }); // Use timestamps: true for automatic createdAt and updatedAt fields

module.exports = mongoose.model("User", userSchema);
