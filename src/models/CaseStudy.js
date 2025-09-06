const mongoose = require("mongoose");

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      trim: true,
    },
    problem: {
      type: String,
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    results: {
      type: String,
      trim: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    image: {
      type: String, 
      trim: true,
    },
    bgColor: {
      type: String,
      default: "bg-gray-200", 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseStudy", caseStudySchema);
