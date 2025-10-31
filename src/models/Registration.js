const mongoose = require('mongoose');

const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;

const RegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: { validator: (v) => emailRegex.test(v), message: 'Invalid email' },
    },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    class: { type: String, trim: true },
    stream: { type: String, trim: true },
    schoolName: { type: String, trim: true },
    schoolBoard: { type: String, trim: true },
    previousPercentage: { type: Number, min: 0, max: 100 },
    examMode: { type: String, trim: true },
    examDate: { type: Date },

    // Metadata
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    source: { type: String, trim: true },
  },
  { timestamps: true }
);

RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ phone: 1 });
RegistrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Registration', RegistrationSchema);
