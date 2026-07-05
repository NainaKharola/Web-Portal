const Student = require("../models/Student");
const {
  sendOfferLetterEmail,
  sendRejectionEmail,
} = require("../services/emailService");

const reviewFields = [
  "status",
  "remark",
  "referenceBy",
  "recommendedBy",
];

const allowedStatuses = ["Pending", "Approved", "Rejected"];

const recommendedByOptions = [
  "Servo System",
  "ABS",
  "SS & ST",
  "NS (Naval System)",
  "OD (Optical Design)",
  "CS & S",
  "ALTDS",
  "LI",
  "LS",
  "LPF",
  "Photonics",
  "EAD",
  "LIDAR",
  "FTIR",
  "HR",
  "MS",
  "ISO",
  "AI",
  "VI",
  "IRST",
  "OME",
  "LIC",
  "ENV",
  "Reprography",
  "MT",
  "P & C",
  "AV",
  "CMD",
];

function buildStudentFilter(query) {
  const filter = {};

  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  if (query.collegeName) filter.collegeName = query.collegeName;
  if (query.branch) filter.branch = query.branch;
  if (query.year) filter.year = query.year;

  if (query.status === "Pending") {
    filter.$or = [
      { status: "Pending" },
      { status: { $exists: false } },
    ];
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.registrationDate) {
    const start = new Date(query.registrationDate);
    const end = new Date(query.registrationDate);
    end.setDate(end.getDate() + 1);

    filter.submittedAt = {
      $gte: start,
      $lt: end,
    };
  }

  return filter;
}

function buildSort(sortBy, sortOrder) {
  const map = {
    collegeName: "collegeName",
    branch: "branch",
    year: "year",
    cgpa: "cgpa",
    submittedAt: "submittedAt",
  };

  if (!map[sortBy]) return { submittedAt: -1 };

  return {
    [map[sortBy]]: sortOrder === "asc" ? 1 : -1,
  };
}

async function getStudents(req, res) {
  try {
    const filter = buildStudentFilter(req.query);
    const sort = buildSort(req.query.sortBy, req.query.sortOrder);

    const students = await Student.find(filter).sort(sort);

    const allStudents = await Student.find({}, "status offerLetterStatus");

    const summary = allStudents.reduce(
      (acc, student) => {
        acc.totalStudents++;

        const status = student.status || "Pending";

        if (status === "Pending") acc.pendingApplications++;
        if (status === "Approved") acc.approvedStudents++;
        if (status === "Rejected") acc.rejectedStudents++;
        if (student.offerLetterStatus === "Sent") acc.offerLettersSent++;

        return acc;
      },
      {
        totalStudents: 0,
        pendingApplications: 0,
        approvedStudents: 0,
        rejectedStudents: 0,
        offerLettersSent: 0,
      }
    );

    return res.status(200).json({
      success: true,
      students,
      summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch students.",
      error: error.message,
    });
  }
}

async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch student details.",
      error: error.message,
    });
  }
}

async function updateStudentReview(req, res) {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid status.",
      });
    }

    if (
      req.body.recommendedBy &&
      !recommendedByOptions.includes(req.body.recommendedBy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Select a valid recommendation.",
      });
    }

    const wasRejected = student.status === "Rejected";

    reviewFields.forEach((field) => {
      student[field] = req.body[field] || "";
    });

    student.reviewedBy = req.admin.email;
    student.reviewedAt = new Date();

    if (student.status === "Approved" && !student.approvedDate) {
      student.approvedDate = new Date();
    }

    await student.save();

    let emailResult = null;

    if (student.status === "Rejected" && !wasRejected) {
      emailResult = await sendRejectionEmail(student);
    }

    return res.status(200).json({
      success: true,
      student,
      email: emailResult,
      message: "Review updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update review.",
      error: error.message,
    });
  }
}

async function uploadOfferLetter(req, res) {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Offer Letter can only be sent after approval.",
      });
    }

    student.offerLetterUrl = req.uploadedOfferLetter.url;
    student.offerLetterPublicId = req.uploadedOfferLetter.publicId;
    student.offerLetterUploadedDate = new Date();
    student.offerLetterSentBy = req.admin.email;

    //const emailResult = await sendOfferLetterEmail(student);

    const emailResult = {
      skipped: true,
      reason: "Testing",
    };

    if (emailResult?.skipped) {
      student.offerLetterStatus = "Not Sent";
      student.offerLetterSentDate = undefined;
    } else {
      student.offerLetterStatus = "Sent";
      student.offerLetterSentDate = new Date();
    }

    await student.save();

    return res.status(200).json({
      success: true,
      student,
      email: emailResult,
      message: emailResult?.skipped
        ? "Offer Letter uploaded. Email was skipped because SMTP is not configured."
        : "Offer Letter uploaded and sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload and send Offer Letter.",
      error: error.message,
    });
  }
}

module.exports = {
  getStudents,
  getStudentById,
  updateStudentReview,
  uploadOfferLetter,
  recommendedByOptions,
};