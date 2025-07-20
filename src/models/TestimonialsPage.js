const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true }, // imagekit.io URL
  stars: { type: Number, required: true, min: 1, max: 5 }
}, { _id: false });

const TestimonialsPageSchema = new mongoose.Schema({
  label: { type: String, required: true },
  heading: { type: String, required: true },
  testimonials: [TestimonialSchema]
}, { timestamps: true });

module.exports = mongoose.model('TestimonialsPage', TestimonialsPageSchema); 