const Student = require("../models/Student");
const cloudinary = require("../config/cloudinary");
const { generatePdfFromHtml } = require("../services/pdfService");
const { uploadBufferToCloudinary } = require("../services/cloudinaryService");
const {
  sendGyapanEmail,
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
  "DIR",
  "HRD",
  "WORKS",
  "MI",
  "SECURITY",
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

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function addDurationToDate(fromDate, duration) {
  if (!fromDate) return "";

  const date = new Date(fromDate);
  if (Number.isNaN(date.getTime())) return "";

  const monthMatch = String(duration || "").match(/(\d+)\s*month/i);
  const weekMatch = String(duration || "").match(/(\d+)\s*week/i);

  if (monthMatch) date.setMonth(date.getMonth() + Number(monthMatch[1]));
  else if (weekMatch) date.setDate(date.getDate() + Number(weekMatch[1]) * 7);
  else return "";

  return date.toISOString().slice(0, 10);
}

function buildGyapanHtml(student, training) {
  const rows = [
    ["Student Name", training.studentName],
    ["College Name", training.collegeName],
    ["College Location", training.collegeLocation],
    ["Course", training.courseName],
    ["Course Year", training.courseYear],
    ["Branch", training.branch],
    ["Training Duration", training.trainingDuration],
    ["Training Period", `${formatDate(training.fromDate)} to ${formatDate(training.toDate)}`],
    ["Joined", training.joined],
    ["Project Title", training.projectTitle],
    ["Project Guide", training.projectGuide],
    ["Designation", training.designation],
    ["Leave Availed", training.leaveAvailed],
    ["Completed", training.completed],
  ];

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; color: #111827; padding: 36px; }
    .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 18px; margin-bottom: 28px; }
    h1 { margin: 0; font-size: 26px; text-transform: uppercase; }
    h2 { margin: 8px 0 0; font-size: 18px; color: #1d4ed8; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 13px; }
    th { width: 34%; background: #eff6ff; }
    .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Gyapan</h1>
    <h2>Defence Research and Development Organisation</h2>
  </div>
  <p>This training record has been generated for ${escapeHtml(student.name)} based on the approved internship registration and Training Management System details.</p>
  <table>
    <tbody>
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value || "-")}</td></tr>`
        )
        .join("")}
    </tbody>
  </table>
  <div class="footer">
    <span>Generated on ${formatDate(new Date())}</span>
    <span>Internship Management Team</span>
  </div>
</body>
</html>`;
}

async function destroyCloudinaryFile(file, resourceType = "auto") {
  if (!file?.publicId) return;
  await cloudinary.uploader.destroy(file.publicId, { resource_type: resourceType });
}

async function removeStudentAssets(student) {
  await Promise.allSettled([
    destroyCloudinaryFile(student.resume, "raw"),
    destroyCloudinaryFile(student.result),
    destroyCloudinaryFile(student.photo, "image"),
    destroyCloudinaryFile(student.permissionLetter),
    destroyCloudinaryFile(student.completedDocuments, "raw"),
    destroyCloudinaryFile(student.gyapan, "raw"),
    destroyCloudinaryFile({
      publicId: student.offerLetter?.publicId || student.offerLetterPublicId,
    }, "raw"),
  ]);
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

async function deleteStudents(req, res) {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];

    if (!ids.length) {
      return res.status(400).json({
        success: false,
        message: "Select at least one registration to delete.",
      });
    }

    const students = await Student.find({ _id: { $in: ids } });
    await Promise.all(students.map(removeStudentAssets));
    await Student.deleteMany({ _id: { $in: students.map((student) => student._id) } });

    return res.status(200).json({
      success: true,
      deletedCount: students.length,
      message: "Selected registrations deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete selected registrations.",
      error: error.message,
    });
  }
}

async function saveTrainingManagement(req, res) {
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
        message: "Training Management System is available only for approved students.",
      });
    }

    const training = {
      studentName: req.body.studentName || student.name,
      courseName: req.body.courseName || student.course,
      courseYear: req.body.courseYear || student.year,
      branch: req.body.branch || student.branch,
      collegeName: req.body.collegeName || student.collegeName,
      collegeLocation: req.body.collegeLocation || student.location,
      trainingDuration: req.body.trainingDuration || student.internshipDuration,
      fromDate: req.body.fromDate || "",
      toDate:
        req.body.toDate ||
        addDurationToDate(req.body.fromDate, req.body.trainingDuration || student.internshipDuration),
      joined: req.body.joined || "",
      projectTitle: req.body.projectTitle || "",
      projectGuide: req.body.projectGuide || "",
      designation: req.body.designation || "",
      leaveAvailed: req.body.leaveAvailed || "",
      completed: req.body.completed || "",
      updatedBy: req.admin.email,
      updatedAt: new Date(),
    };

    if (!training.fromDate || !training.toDate) {
      return res.status(400).json({
        success: false,
        message: "From Date and To Date are required.",
      });
    }

    student.trainingManagement = training;

    const html = buildGyapanHtml(student, training);
    const pdfBuffer = await generatePdfFromHtml(html);
    const uploadResult = await uploadBufferToCloudinary(pdfBuffer, {
      folder: "web-portal/gyapan",
      public_id: `gyapan-${student._id}-${Date.now()}`,
    });

    let emailResult = null;
    try {
      emailResult = await sendGyapanEmail(student, {
        buffer: pdfBuffer,
        filename: `DRDO-Gyapan-${student.referenceId || student._id}.pdf`,
      });
    } catch (emailError) {
      emailResult = {
        skipped: true,
        reason: emailError.message,
      };
    }

    student.gyapan = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      generatedAt: new Date(),
      emailedAt: emailResult?.skipped ? undefined : new Date(),
      emailStatus: emailResult?.skipped ? "Email Failed" : "Sent",
    };

    await student.save();

    return res.status(200).json({
      success: true,
      student,
      email: emailResult,
      message: "Training details saved and Gyapan generated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to save Training Management details.",
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

    // Save Offer Letter details
    student.offerLetterUrl = req.uploadedOfferLetter.url;
    student.offerLetterPublicId = req.uploadedOfferLetter.publicId;
    student.offerLetterUploadedDate = new Date();
    student.offerLetterSentBy = req.admin.email;

    let emailResult = null;

    try {
      // Try sending email
      emailResult = await sendOfferLetterEmail(student);

      if (emailResult?.skipped) {
        student.offerLetterStatus = "Not Sent";
        student.offerLetterSentDate = undefined;
      } else {
        student.offerLetterStatus = "Sent";
        student.offerLetterSentDate = new Date();
      }
    } catch (emailError) {
      console.error("Email Error:", emailError);

      // Don't fail the entire request if email sending fails
      student.offerLetterStatus = "Email Failed";
      student.offerLetterSentDate = undefined;
    }

    await student.save();

    return res.status(200).json({
      success: true,
      student,
      email: emailResult,
      message:
        student.offerLetterStatus === "Sent"
          ? "Offer Letter uploaded and emailed successfully."
          : "Offer Letter uploaded successfully, but email could not be sent.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload Offer Letter.",
      error: error.message,
    });
  }
}

module.exports = {
  deleteStudents,
  getStudents,
  getStudentById,
  updateStudentReview,
  uploadOfferLetter,
  saveTrainingManagement,
  recommendedByOptions,
};
