const mongoose = require('mongoose');

const BlogPageSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  author: { 
    type: String, 
    required: true,
    trim: true
  },
  date: { 
    type: String, 
    required: true
  },
  image: { 
    type: String, 
    required: true
  },
  desc: { 
    type: String, 
    required: true,
    trim: true
  },
  fullContent: { 
    type: String, 
    required: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Video Editing', 'Social Media Marketing', 'Design', 'Other']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true 
});


BlogPageSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
   
    if (slug) {
      slug = slug + '-' + Date.now();
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('BlogPage', BlogPageSchema);