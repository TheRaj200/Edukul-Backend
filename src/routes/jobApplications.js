const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const JobApplication = require('../models/JobApplication');

const router = express.Router();


const uploadDir = path.join(__dirname, '../uploads/resumes');
fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const timestamp = Date.now();
		const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
		cb(null, `${timestamp}_${safeName}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowed = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	];
	if (allowed.includes(file.mimetype)) cb(null, true);
	else cb(new Error('Only PDF/DOC/DOCX files are allowed'));
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 10 * 1024 * 1024 }, 
});


const toNumber = (v) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : undefined;
};


router.post('/', upload.single('resume'), async (req, res) => {
	try {
		const b = req.body || {};

		const appDoc = new JobApplication({
			jobRef: b.jobRef || undefined,
			jobTitle: b.jobTitle || undefined,
			team: b.team || undefined,

			firstName: b.firstName,
			lastName: b.lastName,
			phone: b.phone,
			email: b.email,
			gender: b.gender || undefined,
			dob: b.dob ? new Date(b.dob) : undefined,

			experience: toNumber(b.experience),
			currentSalary: toNumber(b.currentSalary),
			expectedSalary: toNumber(b.expectedSalary),
			availableDays: toNumber(b.availableDays),
			currentLocation: b.currentLocation,

			instagram: b.instagram || undefined,
			linkedin: b.linkedin,
			portfolio: b.portfolio,

			answer1: b.answer1,
			answer2: b.answer2,
			answer3: b.answer3,

			relocation: b.relocation,
			source: b.source,

			userAgent: req.get('user-agent') || undefined,
			ipAddress: req.ip,
		});

		if (req.file) {
			appDoc.resumeOriginalName = req.file.originalname;
			appDoc.resumeMimeType = req.file.mimetype;
			appDoc.resumeSize = req.file.size;

			appDoc.resumePath = path.relative(path.join(__dirname, '../'), req.file.path);
			const publicPath = `/uploads/resumes/${path.basename(req.file.path)}`;
			const publicBase = (process.env.PUBLIC_BASE_URL || process.env.BACKEND_BASE_URL || '').replace(/\/$/, '');
			appDoc.resumeUrl = publicBase ? `${publicBase}${publicPath}` : publicPath; 
		}

		await appDoc.save();
		res.status(201).json({ success: true, data: appDoc });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
});


router.get('/', async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const pageNum = Math.max(parseInt(page) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			JobApplication.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum),
			JobApplication.countDocuments(),
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
		const doc = await JobApplication.findById(req.params.id);
		if (!doc) return res.status(404).json({ success: false, message: 'Application not found.' });
		res.status(200).json({ success: true, data: doc });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});


router.get('/:id/resume', async (req, res) => {
	try {
		const doc = await JobApplication.findById(req.params.id);
		if (!doc) return res.status(404).json({ success: false, message: 'Application not found.' });
		if (!doc.resumePath) return res.status(404).json({ success: false, message: 'Resume not available.' });

		const fullPath = path.join(__dirname, '../', doc.resumePath);
		const filename = doc.resumeOriginalName || path.basename(fullPath);
		if (!fs.existsSync(fullPath)) {
			return res.status(404).json({ success: false, message: 'Resume file not found on server.' });
		}
		if (doc.resumeMimeType) {
			res.setHeader('Content-Type', doc.resumeMimeType);
		}
	
		res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
		return res.download(fullPath, filename, (err) => {
			if (err) {
				if (!res.headersSent) {
					res.status(500).json({ success: false, message: 'Failed to download resume.' });
				}
			}
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});


router.delete('/:id', async (req, res) => {
	try {
		const doc = await JobApplication.findByIdAndDelete(req.params.id);
		if (!doc) return res.status(404).json({ success: false, message: 'Application not found.' });
		
			if (doc.resumePath) {
				const fullPath = path.join(__dirname, '../', doc.resumePath);
			fs.unlink(fullPath, () => {});
		}
		res.status(200).json({ success: true, message: 'Application deleted.' });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

module.exports = router;

