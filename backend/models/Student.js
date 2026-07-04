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
    collegeState: String,
    location: String,

    currentAddress: String,
    permanentAddress: String,

    fatherName: String,
    fatherPhone: String,
    fatherOccupation: String,

    cgpa: Number,

    collegeId: String,

    internshipDuration: String,
    internshipJoiningDate: String,

    permissionLetterNumber: String,
    permissionLetterDate: String,

    resume: {
      url: String,
      publicId: String,
    },

    result: {
      url: String,
      publicId: String,
    },

    photo: {
      url: String,
      publicId: String,
    },

    permissionLetter: {
      url: String,
      publicId: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remark: {
      type: String,
      default: "",
    },
    referenceBy: {
      type: String,
      default: "",
    },
    recommendedBy: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: String,
      default: "",
    },
    reviewedAt: Date,
    approvedDate: Date,
    offerLetterUrl: {
      type: String,
      default: "",
    },
    offerLetterPublicId: {
      type: String,
      default: "",
    },
    offerLetterUploadedDate: Date,
    offerLetterSentDate: Date,
    offerLetterSentBy: {
      type: String,
      default: "",
    },
    offerLetterStatus: {
      type: String,
      enum: ["Not Sent", "Sent"],
      default: "Not Sent",
    },

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
