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
      enum: [
        "Pending",
        "Not Sent",
        "Uploaded",
        "Generated",
        "Sent",
        "Email Failed"
      ],
      default: "Pending"
    },
    offerLetter: {
      generatedBy: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
      issueDate: Date,
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: Date,
      edited: {
        type: Boolean,
        default: false,
      },
      uploadType: {
        type: String,
        enum: ["", "Generated", "Uploaded"],
        default: "",
      },
      letterNumber: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: ["Not Generated", "Generated", "Uploaded", "Sent", "Email Failed"],
        default: "Not Generated",
      },
      html: {
        type: String,
        default: "",
      },
      pdfBuffer: Buffer,
      subject: {
        type: String,
        default: "",
      },
      letterBody: {
        type: String,
        default: "",
      },
      additionalRemarks: {
        type: String,
        default: "",
      },
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
