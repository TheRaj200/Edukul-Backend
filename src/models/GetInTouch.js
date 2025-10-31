const mongoose = require('mongoose');

const GetInTouchSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    class: { type: String, trim: true },

    // Metadata
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    source: { type: String, trim: true },
  },
  { timestamps: true }
);

GetInTouchSchema.index({ phoneNumber: 1 });
GetInTouchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GetInTouch', GetInTouchSchema);
