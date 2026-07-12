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
    internshipJoiningMonth: String,

    referenceId: {
      type: String,
      unique: true,
      index: true,
    },
    serialNumber: {
      type: Number,
      unique: true,
      sparse: true,
      index: true,
    },

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
    completedDocuments: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
      uploadedAt: Date,
    },
    trainingManagement: {
      studentName: String,
      courseName: String,
      courseYear: String,
      branch: String,
      collegeName: String,
      collegeLocation: String,
      trainingDuration: String,
      fromDate: String,
      toDate: String,
      joined: {
        type: String,
        enum: ["", "Yes", "No"],
        default: "",
      },
      projectTitle: String,
      projectGuide: String,
      designation: String,
      leaveAvailed: String,
      completed: {
        type: String,
        enum: ["", "Yes", "No"],
        default: "",
      },
      updatedBy: String,
      updatedAt: Date,
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

studentSchema.index({ status: 1, submittedAt: -1 });
studentSchema.index({ "trainingManagement.completed": 1 });

module.exports = mongoose.model("Student", studentSchema);
