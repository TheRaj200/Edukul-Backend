const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: false },
  stars: { type: Number, required: true }
}, { _id: false });

const TestimonialsPageSchema = new mongoose.Schema({
  label: { type: String, required: true },
  heading: { type: String, required: true },
  testimonials: { type: [TestimonialSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('TestimonialsPage', TestimonialsPageSchema); 