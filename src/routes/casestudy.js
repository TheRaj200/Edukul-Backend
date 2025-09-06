const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CaseStudy = require('../models/CaseStudy');


// Get all case studies
router.get('/', async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    res.json({ success: true, data: caseStudies });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single case study by ID
router.get('/:id', async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    res.json({ success: true, data: caseStudy });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new case study (protected)
router.post('/',  async (req, res) => {
  try {
    const { title, client, problem, solution, results, feedback, image, bgColor } = req.body;
    
    const newCaseStudy = new CaseStudy({
      title,
      client,
      problem,
      solution,
      results,
      feedback,
      image,
      bgColor
    });

    const savedCaseStudy = await newCaseStudy.save();
    res.status(201).json({ success: true, data: savedCaseStudy });
  } catch (error) {
    console.error('Error creating case study:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update case study (protected)
router.put('/:id', async (req, res) => {
  try {
    const { title, client, problem, solution, results, feedback, image, bgColor } = req.body;
    
    const updatedCaseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      {
        title,
        client,
        problem,
        solution,
        results,
        feedback,
        image,
        bgColor
      },
      { new: true }
    );

    if (!updatedCaseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }

    res.json({ success: true, data: updatedCaseStudy });
  } catch (error) {
    console.error('Error updating case study:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete case study (protected)
router.delete('/:id',  async (req, res) => {
  try {
    const deletedCaseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
    
    if (!deletedCaseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }

    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;