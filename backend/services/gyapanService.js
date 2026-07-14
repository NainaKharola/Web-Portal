const fs = require("fs/promises");
const path = require("path");

const templatePath = path.join(__dirname, "..", "templates", "gyapan.html");

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function studentToRow(student) {
  const training = student.trainingManagement || {};
  return {
    studentId: student._id,
    studentName: student.name || "",
    course: student.course || "",
    courseYear: student.year || "",
    branch: student.branch || "",
    collegeName: student.collegeName || "",
    collegeLocation: student.location || "",
    trainingStartDate: training.fromDate || "",
    trainingEndDate: training.toDate || "",
  };
}

function buildStudentRows(rows) {
  return rows.map((row) => `<tr><td>${escapeHtml(row.studentName)}, ${escapeHtml(row.course)} ${escapeHtml(row.courseYear)} ${escapeHtml(row.branch)}</td><td>${escapeHtml(row.collegeName)}</td><td>${escapeHtml(row.collegeLocation)}</td><td>${escapeHtml(formatDate(row.trainingStartDate))}</td><td>${escapeHtml(formatDate(row.trainingEndDate))}</td></tr>`).join("");
}

async function generateGyapanHtml({ rows, letterNumber, issueDate }) {
  const template = await fs.readFile(templatePath, "utf8");
  return template.replace(/{{(studentRows|letterNumber|issueDate)}}/g, (_, key) => {
    if (key === "studentRows") return buildStudentRows(rows);
    return escapeHtml(key === "issueDate" ? formatDate(issueDate) : letterNumber);
  });
}

module.exports = { generateGyapanHtml, studentToRow };
