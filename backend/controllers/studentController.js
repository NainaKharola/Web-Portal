const Student = require("../models/Student");
const cloudinary = require("../config/cloudinary");
const {
  indianStatesAndUnionTerritories,
} = require("../data/indianStates");


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
  "collegeState",
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

  if (!indianStatesAndUnionTerritories.includes(body.collegeState)) {
    return "Select a valid college state or union territory.";
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

    console.log(req.uploadedFiles);

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
      collegeState: req.body.collegeState,
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

      resume: {
        url: req.uploadedFiles.resume.url,
        publicId: req.uploadedFiles.resume.public_id,
      },

      result: {
        url: req.uploadedFiles.result.url,
        publicId: req.uploadedFiles.result.public_id,
      },

      photo: {
        url: req.uploadedFiles.photo.url,
        publicId: req.uploadedFiles.photo.public_id,
      },

      permissionLetter: {
        url: req.uploadedFiles.permissionLetter.url,
        publicId: req.uploadedFiles.permissionLetter.public_id,
      },

      submittedAt: new Date(),
    });

    // Save student only once
    const savedStudent = await student.save();

    return res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      student: savedStudent,
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

async function deleteStudent(req, res) {
  try {
    // Find student
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete Resume from Cloudinary
    if (student.resume?.publicId) {
      await cloudinary.uploader.destroy(student.resume.publicId, {
        resource_type: "raw",
      });
    }

    // Delete Result from Cloudinary
    if (student.result?.publicId) {
      await cloudinary.uploader.destroy(student.result.publicId, {
        resource_type: "auto",
      });
    }

    // Delete Photo from Cloudinary
    if (student.photo?.publicId) {
      await cloudinary.uploader.destroy(student.photo.publicId);
    }

    // Delete Permission Letter from Cloudinary
    if (student.permissionLetter?.publicId) {
      await cloudinary.uploader.destroy(student.permissionLetter.publicId, {
        resource_type: "auto",
      });
    }

    // Delete Student from MongoDB
    await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Student and all uploaded files deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete student.",
      error: error.message,
    });
  }
}

module.exports = {
  createStudent,
  deleteStudent,
};
