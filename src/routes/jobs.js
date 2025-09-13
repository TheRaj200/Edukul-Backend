const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {

    return value
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};


router.get('/', async (req, res) => {
  try {
    const { q, isActive, page = 1, limit = 10, team } = req.query;
    const query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (team) {
      query.team = team;
    }
    if (isActive === 'true' || isActive === 'false') {
      query.isActive = isActive === 'true';
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      title,
      team,
      company,
      location,
      type,
      mode,
      experience,
      email,
      about,
      description,
      responsibilities,
      requirements,
      perks,
      isActive,
    } = req.body;

    if (!title || !team || !description) {
      return res.status(400).json({ success: false, message: 'Title, Team and Description are required.' });
    }

    const job = new Job({
      title: title.trim(),
      team: team.trim(),
      company: company?.trim() || undefined,
      location: location?.trim() || undefined,
      type: type?.trim() || undefined,
      mode: mode?.trim() || undefined,
      experience: experience?.trim() || undefined,
      email: email?.trim() || undefined,
      about: (about || '').trim(),
      description: description.trim(),
      responsibilities: toArray(responsibilities),
      requirements: toArray(requirements),
      perks: toArray(perks),
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating job: ' + err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const body = req.body || {};


    if (body.title !== undefined) job.title = body.title.trim();
    if (body.team !== undefined) job.team = body.team.trim();
    if (body.company !== undefined) job.company = body.company?.trim() || '';
    if (body.location !== undefined) job.location = body.location?.trim() || '';
    if (body.type !== undefined) job.type = body.type?.trim() || '';
    if (body.mode !== undefined) job.mode = body.mode?.trim() || '';
    if (body.experience !== undefined) job.experience = body.experience?.trim() || '';
    if (body.email !== undefined) job.email = body.email?.trim() || '';
    if (body.about !== undefined) job.about = (body.about || '').trim();
    if (body.description !== undefined) job.description = body.description?.trim() || job.description;
    if (body.responsibilities !== undefined) job.responsibilities = toArray(body.responsibilities);
    if (body.requirements !== undefined) job.requirements = toArray(body.requirements);
    if (body.perks !== undefined) job.perks = toArray(body.perks);
    if (body.isActive !== undefined) job.isActive = !!body.isActive;

    await job.save();
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating job: ' + err.message });
  }
});


router.patch('/:id/toggle', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    job.isActive = !job.isActive;
    await job.save();
    res.status(200).json({ success: true, data: job, message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error toggling job: ' + err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.status(200).json({ success: true, message: 'Job deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting job: ' + err.message });
  }
});

module.exports = router;
