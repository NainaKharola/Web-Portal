const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  "drdo_offer_letter.html",
);

const logoPath = path.join(__dirname, "..", "templates", "drdo_logo.png");

const bannerPath = path.join(__dirname, "..", "templates", "ssa_banner.png");

// Convert images to Base64 so Puppeteer always renders them
const logoBase64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
  : "";

const bannerBase64 = fs.existsSync(bannerPath)
  ? `data:image/png;base64,${fs.readFileSync(bannerPath).toString("base64")}`
  : "";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function paragraphsFromText(value) {
  const text = String(value || "").trim();

  if (!text) return "";

  return text
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

function formatDate(value) {
  if (!value) return new Date().toLocaleDateString("en-IN");
  return new Date(value).toLocaleDateString("en-IN");
}

function defaultLetterNumber(student) {
  const suffix = String(student._id || "")
    .slice(-6)
    .toUpperCase();
  const year = new Date().getFullYear();
  return `DRDO/INT/${year}/${suffix}`;
}

function getDefaultEditableContent(student) {
  return {
    subject: "Offer Letter for Internship",
    letterBody: `Dear ${student.name || "Student"},

With reference to your application, we are pleased to offer you an internship opportunity with DRDO for the duration mentioned below. This offer is subject to verification of submitted documents and compliance with all instructions issued by the department.`,
    additionalRemarks:
      "You are requested to report as per the instructions shared by the Internship Registration and Management Cell.",
  };
}

function buildTemplateData(student, overrides = {}) {
  const defaults = getDefaultEditableContent(student);

  const issueDate =
    overrides.issueDate || student.offerLetter?.issueDate || new Date();

  // Always use the latest duration
  const duration =
    overrides.internshipDuration ||
    overrides.duration ||
    student.trainingManagement?.trainingDuration ||
    student.offerLetter?.internshipDuration ||
    student.internshipDuration ||
    "";

  return {
    logoUrl: overrides.logoUrl || logoBase64,
    bannerUrl: bannerBase64,

    studentName:
      overrides.studentName ||
      student.offerLetter?.studentName ||
      student.name ||
      "",

    course:
      overrides.course || student.offerLetter?.course || student.course || "",

    year: overrides.year || student.offerLetter?.year || student.year || "",

    branch:
      overrides.branch || student.offerLetter?.branch || student.branch || "",

    collegeName:
      overrides.collegeName ||
      student.offerLetter?.collegeName ||
      student.collegeName ||
      "",

    collegeLocation:
      overrides.collegeLocation ||
      student.offerLetter?.collegeLocation ||
      student.trainingManagement?.collegeLocation ||
      student.location ||
      "",

    collegeAddress:
      overrides.collegeAddress || student.offerLetter?.collegeAddress || "",

    collegeAddress: overrides.collegeAddress || "",

    internshipDuration: duration,
    duration: duration,

    issueDate: formatDate(issueDate),

    letterNumber:
      overrides.letterNumber ||
      student.offerLetter?.letterNumber ||
      defaultLetterNumber(student),

    subject:
      overrides.subject || student.offerLetter?.subject || defaults.subject,

    letterBody:
      overrides.letterBody ||
      student.offerLetter?.letterBody ||
      defaults.letterBody,

    additionalRemarks:
      overrides.additionalRemarks ||
      student.offerLetter?.additionalRemarks ||
      defaults.additionalRemarks,
  };
}

async function readOfferLetterTemplate() {
  return fsp.readFile(templatePath, "utf8");
}

async function generateOfferLetterHtml(student, overrides = {}) {
  const template = await readOfferLetterTemplate();
  const data = buildTemplateData(student, overrides);

  const finalHtml = template.replace(/{{(\w+)}}/g, (match, key) => {
    if (key === "letterBody" || key === "additionalRemarks") {
      return paragraphsFromText(data[key]);
    }

    // Don't escape Base64 image URLs
    if (key === "logoUrl" || key === "bannerUrl") {
      return data[key];
    }

    return escapeHtml(data[key] ?? "");
  });

  return finalHtml;
}

module.exports = {
  buildTemplateData,
  defaultLetterNumber,
  generateOfferLetterHtml,
  getDefaultEditableContent,
};
