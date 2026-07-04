const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    course: String,
    branch: String,
    year: String,

    phone: String,
    email: String,
    dob: String,
    aadhaarNumber: String,

    collegeName: String,
    location: String,

    currentAddress: String,
    permanentAddress: String,

    fatherName: String,
    fatherPhone: String,
    fatherOccupation: String,

    cgpa: Number,

    collegeId: String,

    internshipDuration: String,

    permissionLetterNumber: String,
    permissionLetterDate: String,

    resume: String,
    result: String,
    photo: String,
    permissionLetter: String,

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Student", studentSchema);