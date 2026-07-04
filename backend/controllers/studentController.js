const Student = require("../models/Student");
const { toPublicUploadPath } = require("../utils/filePath");

const requiredFields = [
  "name",
  "course",
  "branch",
  "currentYear",
  "phone",
  "email",
  "dob",
  "aadhaarNumber",
  "collegeName",
  "collegeLocation",
  "currentAddress",
  "permanentAddress",
  "fatherName",
  "fatherPhone",
  "fatherOccupation",
  "cgpa",
  "collegeId",
  "internshipDuration",
  "permissionLetterNumber",
  "permissionLetterDate",
];

function validateRequest(body, files) {
  const missingFields = requiredFields.filter(
    (field) => !String(body[field] || "").trim()
  );

  const missingFiles = [
    "resume",
    "result",
    "photo",
    "permissionLetter",
  ].filter((field) => !files?.[field]?.[0]);

  if (missingFields.length || missingFiles.length) {
    return `Missing required fields: ${[
      ...missingFields,
      ...missingFiles,
    ].join(", ")}`;
  }

  if (!/^\d{10}$/.test(body.phone)) {
    return "Phone number must be exactly 10 digits.";
  }

  if (!/^\d{10}$/.test(body.fatherPhone)) {
    return "Father contact number must be exactly 10 digits.";
  }

  if (!/^\d{12}$/.test(body.aadhaarNumber)) {
    return "Aadhaar Number must contain exactly 12 digits.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "Enter a valid email address.";
  }

  if (new Date(body.dob) > new Date()) {
    return "Date of birth cannot be in the future.";
  }

  const cgpa = Number(body.cgpa);

  if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    return "CGPA must be between 0 and 10.";
  }

  return "";
}

async function createStudent(req, res) {
  try {
    const validationError = validateRequest(req.body, req.files);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const student = new Student({
      name: req.body.name,
      course: req.body.course,
      branch: req.body.branch,
      year: req.body.currentYear,

      phone: req.body.phone,
      email: req.body.email,
      dob: req.body.dob,

      aadhaarNumber: req.body.aadhaarNumber,

      collegeName: req.body.collegeName,
      location: req.body.collegeLocation,

      currentAddress: req.body.currentAddress,
      permanentAddress: req.body.permanentAddress,

      fatherName: req.body.fatherName,
      fatherPhone: req.body.fatherPhone,
      fatherOccupation: req.body.fatherOccupation,

      cgpa: Number(req.body.cgpa),

      collegeId: req.body.collegeId,

      internshipDuration: req.body.internshipDuration,

      permissionLetterNumber: req.body.permissionLetterNumber,
      permissionLetterDate: req.body.permissionLetterDate,

      resume: toPublicUploadPath(req.files.resume[0].path),
      result: toPublicUploadPath(req.files.result[0].path),
      photo: toPublicUploadPath(req.files.photo[0].path),
      permissionLetter: toPublicUploadPath(
        req.files.permissionLetter[0].path
      ),

      submittedAt: new Date(),
    });

    await student.save();

    return res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      student,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to register student. Please try again.",
      error: error.message,
    });
  }
}

module.exports = {
  createStudent,
};