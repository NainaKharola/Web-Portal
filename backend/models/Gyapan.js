const mongoose = require("mongoose");

const studentRowSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  studentName: String,
  course: String,
  courseYear: String,
  branch: String,
  collegeName: String,
  collegeLocation: String,
  trainingStartDate: String,
  trainingEndDate: String,
}, { _id: false });

const gyapanSchema = new mongoose.Schema({
  generated: { type: Boolean, default: false },
  generatedDate: Date,
  generatedBy: { type: String, default: "" },
  pdfUrl: { type: String, default: "" },
  gyapanUrl: { type: String, default: "" },
  publicId: { type: String, default: "" },
  uploadType: { type: String, default: "Generated" },
  letterNumber: { type: String, default: "" },
  issueDate: Date,
  selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  studentRows: [studentRowSchema],
  html: { type: String, default: "" },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Gyapan", gyapanSchema);
