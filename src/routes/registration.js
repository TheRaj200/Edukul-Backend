const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// POST / => create a new registration
router.post('/', async (req, res) => {
  try {
    const data = req.body || {};
    console.log('Incoming registration POST body:', JSON.stringify(data));

    // Basic required validation
    if (!data.fullName || !data.email || !data.phone || !data.examMode || !data.examDate) {
      console.warn('Registration validation failed - missing required fields:', {
        fullName: !!data.fullName,
        email: !!data.email,
        phone: !!data.phone,
        examMode: !!data.examMode,
        examDate: !!data.examDate,
      });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // coerce examDate and dateOfBirth to Date if strings
    if (data.examDate && typeof data.examDate === 'string') {
      data.examDate = new Date(data.examDate);
    }
    if (data.dateOfBirth && typeof data.dateOfBirth === 'string') {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    // Attach request metadata
    data.ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    data.userAgent = req.get('User-Agent') || '';

    const registration = new Registration(data);
    const saved = await registration.save();

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Registration save error:', err && err.stack ? err.stack : err);
    // Return error message for easier debugging locally (avoid exposing in production)
    return res.status(500).json({ success: false, message: err && err.message ? err.message : 'Server error' });
  }
});

// GET / => list registrations with pagination
// Query params: page (1-based), limit (optional)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      Registration.countDocuments(),
      Registration.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.json({ success: true, data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Registration list error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /:id => delete a registration by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Registration.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('Registration delete error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
