const mongoose = require('mongoose');

// Basic validators
const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-._~:\/?#\[\]@!$&'()*+,;=.]+$/i;

const JobApplicationSchema = new mongoose.Schema(
	{
		// Optional linkage to a Job posting
		jobRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
		jobTitle: { type: String, trim: true },
		team: { type: String, trim: true },

		// Personal information
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: (v) => emailRegex.test(v),
				message: 'Invalid email format',
			},
		},
		gender: { type: String, trim: true, enum: ['male', 'female', 'other'] },
		dob: { type: Date },

		// Work & salary
		experience: { type: Number, min: 0, default: 0 },
		currentSalary: { type: Number, min: 0, default: 0 },
		expectedSalary: { type: Number, min: 0, default: 0 },
		availableDays: { type: Number, min: 0, default: 0 },
		currentLocation: { type: String, trim: true },

		// Social & portfolio
		instagram: { type: String, trim: true },
		linkedin: {
			type: String,
			trim: true,
			validate: {
				validator: (v) => !v || urlRegex.test(v),
				message: 'Invalid LinkedIn URL',
			},
		},
		portfolio: {
			type: String,
			trim: true,
			validate: {
				validator: (v) => !v || urlRegex.test(v),
				message: 'Invalid portfolio URL',
			},
		},

		// Questionnaire
		answer1: { type: String, trim: true },
		answer2: { type: String, trim: true },
		answer3: { type: String, trim: true },

		relocation: { type: String, enum: ['yes', 'no'], trim: true },
		source: { type: String, trim: true },

		// Resume file metadata (for uploads handled at route/controller)
		resumeOriginalName: { type: String, trim: true },
		resumeMimeType: { type: String, trim: true },
		resumeSize: { type: Number, min: 0 },
		resumePath: { type: String, trim: true }, // local storage path
		resumeUrl: { type: String, trim: true }, // public URL if served statically

		// Workflow
		status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected'], default: 'new' },
		notes: { type: String, trim: true },

		// Metadata
		userAgent: { type: String, trim: true },
		ipAddress: { type: String, trim: true },
	},
	{ timestamps: true }
);

// Useful indices for faster admin queries
JobApplicationSchema.index({ email: 1 });
JobApplicationSchema.index({ phone: 1 });
JobApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);

