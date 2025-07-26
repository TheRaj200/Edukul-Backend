const express = require('express');
const router = express.Router();
const BlogPage = require('../models/BlogPage');

// GET /api/blogpage/ - fetch all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await BlogPage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogpage/:id - fetch single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await BlogPage.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogpage/slug/:slug - fetch single blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await BlogPage.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    // Increment views
    blog.views += 1;
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blogpage/ - create new blog
router.post('/', async (req, res) => {
  const { title, author, date, image, desc, fullContent, category } = req.body;
  
  try {
    // Validate required fields
    if (!title || !author || !date || !image || !desc || !fullContent || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate category
    const validCategories = ['Video Editing', 'Social Media Marketing', 'Design', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
    }

    const blog = new BlogPage({
      title: title.trim(),
      author: author.trim(),
      date,
      image,
      desc: desc.trim(),
      fullContent,
      category
    });
    
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error('Error creating blog:', err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A blog with this title already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error creating blog: ' + err.message 
    });
  }
});

// PUT /api/blogpage/:id - update blog
router.put('/:id', async (req, res) => {
  const { title, author, date, image, desc, fullContent, category, isPublished, featured } = req.body;
  
  try {
    const blog = await BlogPage.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    
    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.date = date || blog.date;
    blog.image = image || blog.image;
    blog.desc = desc || blog.desc;
    blog.fullContent = fullContent || blog.fullContent;
    blog.category = category || blog.category;
    blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
    blog.featured = featured !== undefined ? featured : blog.featured;
    
    // Regenerate slug if title changed
    if (title && title !== blog.title) {
      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      // Add timestamp to ensure uniqueness
      if (slug) {
        slug = slug + '-' + Date.now();
      }
      
      blog.slug = slug;
    }
    
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating blog: ' + err.message 
    });
  }
});

// DELETE /api/blogpage/:id - delete blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await BlogPage.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.status(200).json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogpage/category/:category - fetch blogs by category
router.get('/category/:category', async (req, res) => {
  try {
    const blogs = await BlogPage.find({ 
      category: req.params.category,
      isPublished: true 
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogpage/featured/featured - fetch featured blogs
router.get('/featured/featured', async (req, res) => {
  try {
    const blogs = await BlogPage.find({ 
      featured: true,
      isPublished: true 
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 