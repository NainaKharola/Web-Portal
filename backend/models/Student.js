const mongoose = require("mongoose");
const { createLocalModel, syncMongoCollection } = require("../services/localStorageService");

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
      // subject: {
      //   type: String,
      //   default: "",
      // },
      // letterBody: {
      //   type: String,
      //   default: "",
      // },
      // additionalRemarks: {
      //   type: String,
      //   default: "",
      // },
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
      joinedDate: Date,
      projectTitle: String,
      projectGuide: String,
      designation: String,
      leaveAvailed: String,
      completed: {
        type: String,
        enum: ["", "Yes", "No"],
        default: "",
      },
      completionDate: Date,
      updatedBy: String,
      updatedAt: Date,
    },

    // Canonical workflow fields. The nested trainingManagement fields remain
    // supported for existing records and the training-management form.
    joinedStatus: {
      type: String,
      enum: ["", "Yes", "No"],
      default: "",
    },
    joinedDate: Date,
    completedStatus: {
      type: String,
      enum: ["", "Yes", "No"],
      default: "",
    },
    completedDate: Date,
    // Document workflow flags. These live on Student so every admin module
    // reads the same source of truth for document availability.
    gyapanGenerated: {
      type: Boolean,
      default: false,
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
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
studentSchema.index({ "trainingManagement.joined": 1, "trainingManagement.joinedDate": 1 });
studentSchema.index({ "trainingManagement.completionDate": 1 });
studentSchema.index({ joinedStatus: 1, joinedDate: 1 });
studentSchema.index({ completedStatus: 1, completedDate: 1 });
studentSchema.index({ completedStatus: 1, gyapanGenerated: 1 });
studentSchema.index({ completedStatus: 1, certificateGenerated: 1, name: 1 });
studentSchema.index({ submittedAt: -1 });
studentSchema.index({ name: 1 });
studentSchema.index({ "trainingManagement.toDate": -1 });
studentSchema.post("save", async () => {
  await syncMongoCollection(mongoose.model("Student"), "students.json");
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = createLocalModel(StudentModel, "students.json", {
  status: "Pending",
  remark: "",
  referenceBy: "",
  recommendedBy: "",
  offerLetterStatus: "Pending",
  offerLetter: {},
  trainingManagement: {},
  gyapanGenerated: false,
  certificateGenerated: false,
  submittedAt: new Date(),
});
