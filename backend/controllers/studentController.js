const fs = require("fs").promises;
const path = require("path");
const { toPublicUploadPath } = require("../utils/filePath");

const DATA_FILE = path.join(__dirname, "..", "data", "students.json");

const requiredFields = [
  "name",
  "course",
  "branch",
  "currentYear",
  "phone",
  "email",
  "dob",
  "collegeName",
  "collegeLocation",
  "currentAddress",
  "permanentAddress",
  "fatherName",
  "fatherPhone",
  "fatherOccupation",
  "cgpa",
  "collegeId",
];

async function readStudents() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(fileContent || "[]");
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeStudents(students) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), "utf8");
}

function validateRequest(body, files) {
  const missingFields = requiredFields.filter((field) => !String(body[field] || "").trim());
  const missingFiles = ["resume", "result", "photo"].filter((field) => !files?.[field]?.[0]);

  if (missingFields.length || missingFiles.length) {
    return `Missing required fields: ${[...missingFields, ...missingFiles].join(", ")}`;
  }

  if (!/^\d{10}$/.test(body.phone)) return "Phone number must be exactly 10 digits.";
  if (!/^\d{10}$/.test(body.fatherPhone)) return "Father contact number must be exactly 10 digits.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Enter a valid email address.";
  if (new Date(body.dob) > new Date()) return "Date of birth cannot be in the future.";

  const cgpa = Number(body.cgpa);
  if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) return "CGPA must be between 0 and 10.";
  if (cgpa < 7.5) return "Minimum CGPA required is 7.5.";

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

    const students = await readStudents();
    const nextId = students.length ? Math.max(...students.map((student) => Number(student.id) || 0)) + 1 : 1;

    const student = {
      id: nextId,
      name: req.body.name,
      course: req.body.course,
      branch: req.body.branch,
      year: req.body.currentYear,
      phone: req.body.phone,
      email: req.body.email,
      dob: req.body.dob,
      collegeName: req.body.collegeName,
      location: req.body.collegeLocation,
      currentAddress: req.body.currentAddress,
      permanentAddress: req.body.permanentAddress,
      fatherName: req.body.fatherName,
      fatherPhone: req.body.fatherPhone,
      fatherOccupation: req.body.fatherOccupation,
      cgpa: req.body.cgpa,
      resume: toPublicUploadPath(req.files.resume[0].path),
      result: toPublicUploadPath(req.files.result[0].path),
      photo: toPublicUploadPath(req.files.photo[0].path),
      collegeId: req.body.collegeId,
      submittedAt: new Date().toISOString(),
    };

    students.push(student);
    await writeStudents(students);

    return res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to register student. Please try again.",
    });
  }
}

module.exports = { createStudent };
