const mongoose = require('mongoose');

const ServiceCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  videoUrl: { type: String, default: '' }
}, { _id: false });

const ServicesPageSchema = new mongoose.Schema({
  tagline: { type: String, required: true },
  heading: { type: String, required: true },
  services: [ServiceCardSchema],
  discussLink: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ServicesPage', ServicesPageSchema);