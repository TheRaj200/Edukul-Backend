const express = require('express');
const router = express.Router();
const BlogPage = require('../models/BlogPage');

// GET /api/blogpage/ - fetch all published blogs
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    
    const blogs = await BlogPage.find({
      $or: [
        { isPublished: true },
        { 
          isScheduled: true, 
          scheduledFor: { $lte: currentDate } 
        }
      ]
    }).sort({ createdAt: -1 });
    
    // Auto-publish scheduled blogs whose time has passed
    const scheduledBlogs = blogs.filter(blog => 
      blog.isScheduled && 
      blog.scheduledFor <= currentDate && 
      !blog.isPublished
    );
    
    // Update the scheduled blogs to published if their time has passed
    if (scheduledBlogs.length > 0) {
      for (const blog of scheduledBlogs) {
        blog.isPublished = true;
        await blog.save();
      }
    }
    
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogpage/all - fetch all blogs including future scheduled ones
router.get('/all', async (req, res) => {
  try {
    // Get all blogs including scheduled ones that will be published in the future
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


router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await BlogPage.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
 
    blog.views += 1;
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/', async (req, res) => {
  const { title, author, date, image, desc, fullContent, category, tags, scheduledFor, isScheduled } = req.body;
  
  try {
  
    if (!title || !author || !date || !image || !desc || !fullContent || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }


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
      category,
      tags: tags || [],
      scheduledFor: scheduledFor || null,
      isScheduled: isScheduled || false,
      isPublished: isScheduled ? false : true
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


router.put('/:id', async (req, res) => {
  const { title, author, date, image, desc, fullContent, category, isPublished, featured, tags, scheduledFor, isScheduled } = req.body;
  
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
    
    // Handle scheduling
    if (scheduledFor !== undefined) {
      blog.scheduledFor = scheduledFor;
    }
    
    if (isScheduled !== undefined) {
      blog.isScheduled = isScheduled;
      // If blog is scheduled, set isPublished to false
      if (isScheduled) {
        blog.isPublished = false;
      }
    } else {
      blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
    }
    
    blog.featured = featured !== undefined ? featured : blog.featured;
    blog.tags = tags || blog.tags;
    
    // Regenerate slug if title changed
    if (title && title !== blog.title) {
      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      
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