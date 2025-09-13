const mongoose = require('mongoose');

const stringArraySanitizer = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((v) => v && v.length > 0);
};

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    team: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      default: 'Adryter',
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    // Example values: "Full-time", "Part-time", "Contract", "Internship"
    type: {
      type: String,
      trim: true,
      default: '',
    },
    // Example values: "Full-Time", "Part-Time", "Remote", "Hybrid"
    mode: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v) return true; // allow empty
          return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    about: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
      set: stringArraySanitizer,
    },
    requirements: {
      type: [String],
      default: [],
      set: stringArraySanitizer,
    },
    perks: {
      type: [String],
      default: [],
      set: stringArraySanitizer,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for quick search on common fields
JobSchema.index({ title: 'text', company: 'text', location: 'text', team: 'text' });

module.exports = mongoose.model('Job', JobSchema);
